-- Primeiro, vamos criar uma função para verificar roles de usuário sem recursão RLS
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT perfil FROM public.usuarios WHERE user_id = $1 AND status = 'Ativo';
$$;

-- Função para verificar se o usuário tem um perfil específico
CREATE OR REPLACE FUNCTION public.has_profile(user_id uuid, profile_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE user_id = $1 AND perfil = profile_name AND status = 'Ativo'
  );
$$;

-- Trigger para criar automaticamente um registro na tabela usuarios quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.usuarios (user_id, nome, email, perfil, status)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.email), 
    NEW.email, 
    'Operador', -- Perfil padrão para novos usuários
    'Ativo'
  );
  RETURN NEW;
END;
$$;

-- Criar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atualizar políticas RLS para usuarios
DROP POLICY IF EXISTS "Permitir tudo para usuarios" ON public.usuarios;

-- Usuários podem ver seus próprios dados
CREATE POLICY "Users can view own profile" ON public.usuarios
  FOR SELECT USING (auth.uid() = user_id);

-- Administradores podem ver todos os usuários
CREATE POLICY "Admins can view all users" ON public.usuarios
  FOR SELECT USING (public.has_profile(auth.uid(), 'Administrador'));

-- Administradores podem inserir, atualizar e deletar usuários
CREATE POLICY "Admins can manage users" ON public.usuarios
  FOR ALL USING (public.has_profile(auth.uid(), 'Administrador'));

-- Supervisores podem ver usuários operadores
CREATE POLICY "Supervisors can view operators" ON public.usuarios
  FOR SELECT USING (
    public.has_profile(auth.uid(), 'Supervisor') AND perfil = 'Operador'
  );