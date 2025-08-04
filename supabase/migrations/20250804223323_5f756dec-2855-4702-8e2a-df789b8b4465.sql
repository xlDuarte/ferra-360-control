-- Criação das tabelas principais para o sistema de ferramentaria

-- Tabela de setores
CREATE TABLE public.setores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  responsavel TEXT,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de fornecedores
CREATE TABLE public.fornecedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cnpj TEXT,
  contato TEXT,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de ferramentas
CREATE TABLE public.ferramentas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  fabricante TEXT,
  fornecedor_id UUID REFERENCES public.fornecedores(id),
  categoria TEXT,
  tipo TEXT,
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Em Reafiamento', 'Descartada', 'Manutenção')),
  quantidade INTEGER NOT NULL DEFAULT 0,
  disponivel INTEGER NOT NULL DEFAULT 0,
  estoque_minimo INTEGER NOT NULL DEFAULT 0,
  localizacao TEXT,
  data_aquisicao DATE,
  valor_unitario DECIMAL(10,2),
  custo_aquisicao DECIMAL(10,2),
  custo_reafiacao DECIMAL(10,2),
  vida_util_meses INTEGER,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de usuários (profiles)
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  perfil TEXT NOT NULL DEFAULT 'Operador' CHECK (perfil IN ('Admin', 'Supervisor', 'Operador', 'Almoxarife')),
  setor_id UUID REFERENCES public.setores(id),
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de movimentações
CREATE TABLE public.movimentacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ferramenta_id UUID NOT NULL REFERENCES public.ferramentas(id),
  usuario_id UUID NOT NULL REFERENCES public.usuarios(id),
  setor_id UUID REFERENCES public.setores(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('Entrada', 'Saída', 'Reafiamento', 'Devolução', 'Ajuste', 'Descarte')),
  quantidade INTEGER NOT NULL,
  saldo_anterior INTEGER NOT NULL,
  saldo_atual INTEGER NOT NULL,
  observacoes TEXT,
  numero_nf TEXT,
  valor_unitario DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'Concluído' CHECK (status IN ('Pendente', 'Concluído', 'Cancelado', 'Em Andamento')),
  data_movimentacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de histórico de estoque
CREATE TABLE public.historico_estoque (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ferramenta_id UUID NOT NULL REFERENCES public.ferramentas(id),
  movimentacao_id UUID REFERENCES public.movimentacoes(id),
  quantidade_anterior INTEGER NOT NULL,
  quantidade_atual INTEGER NOT NULL,
  tipo_operacao TEXT NOT NULL,
  data_operacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  usuario_id UUID REFERENCES public.usuarios(id),
  observacoes TEXT
);

-- Tabela de custos
CREATE TABLE public.custos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ferramenta_id UUID NOT NULL REFERENCES public.ferramentas(id),
  tipo_custo TEXT NOT NULL CHECK (tipo_custo IN ('Aquisição', 'Reafiação', 'Manutenção', 'Descarte')),
  valor DECIMAL(10,2) NOT NULL,
  data_custo DATE NOT NULL,
  fornecedor_id UUID REFERENCES public.fornecedores(id),
  numero_nf TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ferramentas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (permitir tudo por enquanto)
CREATE POLICY "Permitir tudo para setores" ON public.setores FOR ALL USING (true);
CREATE POLICY "Permitir tudo para fornecedores" ON public.fornecedores FOR ALL USING (true);
CREATE POLICY "Permitir tudo para ferramentas" ON public.ferramentas FOR ALL USING (true);
CREATE POLICY "Permitir tudo para usuarios" ON public.usuarios FOR ALL USING (true);
CREATE POLICY "Permitir tudo para movimentacoes" ON public.movimentacoes FOR ALL USING (true);
CREATE POLICY "Permitir tudo para historico_estoque" ON public.historico_estoque FOR ALL USING (true);
CREATE POLICY "Permitir tudo para custos" ON public.custos FOR ALL USING (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_setores_updated_at BEFORE UPDATE ON public.setores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_fornecedores_updated_at BEFORE UPDATE ON public.fornecedores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ferramentas_updated_at BEFORE UPDATE ON public.ferramentas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_movimentacoes_updated_at BEFORE UPDATE ON public.movimentacoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para atualizar estoque automaticamente
CREATE OR REPLACE FUNCTION public.atualizar_estoque_ferramenta()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza a quantidade disponível da ferramenta
  IF TG_OP = 'INSERT' THEN
    IF NEW.tipo IN ('Entrada', 'Devolução') THEN
      UPDATE public.ferramentas 
      SET disponivel = disponivel + NEW.quantidade,
          quantidade = GREATEST(quantidade, disponivel + NEW.quantidade)
      WHERE id = NEW.ferramenta_id;
    ELSIF NEW.tipo IN ('Saída', 'Reafiamento', 'Descarte') THEN
      UPDATE public.ferramentas 
      SET disponivel = GREATEST(0, disponivel - NEW.quantidade)
      WHERE id = NEW.ferramenta_id;
    END IF;
    
    -- Insere no histórico
    INSERT INTO public.historico_estoque (ferramenta_id, movimentacao_id, quantidade_anterior, quantidade_atual, tipo_operacao, usuario_id)
    SELECT NEW.ferramenta_id, NEW.id, NEW.saldo_anterior, NEW.saldo_atual, NEW.tipo, NEW.usuario_id;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estoque
CREATE TRIGGER trigger_atualizar_estoque 
  AFTER INSERT ON public.movimentacoes 
  FOR EACH ROW EXECUTE FUNCTION public.atualizar_estoque_ferramenta();

-- Inserir dados básicos
INSERT INTO public.setores (nome, responsavel, descricao) VALUES 
('Usinagem', 'João Silva', 'Setor de usinagem e torneamento'),
('Estoque', 'Maria Santos', 'Controle e gestão de estoque'),
('Qualidade', 'Pedro Costa', 'Controle de qualidade'),
('Tornos CNC', 'Ana Oliveira', 'Operação de tornos CNC'),
('Manutenção', 'Carlos Mendes', 'Manutenção de equipamentos');

INSERT INTO public.fornecedores (nome, cnpj, contato, email, telefone, status) VALUES
('Sandvik do Brasil', '12.345.678/0001-90', 'Roberto Silva', 'vendas@sandvik.com.br', '(11) 4567-8900', 'Ativo'),
('Kennametal Brasil', '98.765.432/0001-10', 'Ana Costa', 'comercial@kennametal.com.br', '(11) 3456-7890', 'Ativo'),
('Walter do Brasil', '11.222.333/0001-44', 'Pedro Santos', 'vendas@walter.com.br', '(11) 2345-6789', 'Ativo'),
('OSG Brasil', '55.666.777/0001-88', 'Maria Oliveira', 'contato@osg.com.br', '(11) 1234-5678', 'Ativo');