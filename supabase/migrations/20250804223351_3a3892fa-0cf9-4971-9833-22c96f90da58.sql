-- Create tools table (ferramentas)
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Disponível',
  quantidade_total INTEGER NOT NULL DEFAULT 0,
  quantidade_disponivel INTEGER NOT NULL DEFAULT 0,
  quantidade_minima INTEGER NOT NULL DEFAULT 5,
  custo_unitario DECIMAL(10,2) NOT NULL DEFAULT 0,
  localizacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sectors table (setores)
CREATE TABLE public.sectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  responsavel TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create movements table (movimentacoes)
CREATE TABLE public.movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES public.tools(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('Entrada', 'Saída', 'Reafiamento', 'Retorno', 'Descarte')),
  quantidade INTEGER NOT NULL,
  quantidade_antes INTEGER NOT NULL,
  quantidade_depois INTEGER NOT NULL,
  usuario TEXT NOT NULL,
  sector_id UUID REFERENCES public.sectors(id),
  setor TEXT NOT NULL,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'Concluído',
  custo_total DECIMAL(10,2),
  data_movimento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stock history table for tracking changes
CREATE TABLE public.stock_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES public.tools(id),
  movement_id UUID REFERENCES public.movements(id),
  quantidade_anterior INTEGER NOT NULL,
  quantidade_nova INTEGER NOT NULL,
  tipo_alteracao TEXT NOT NULL,
  data_alteracao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (since no auth is implemented yet)
CREATE POLICY "Allow all operations on tools" ON public.tools FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sectors" ON public.sectors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on movements" ON public.movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on stock_history" ON public.stock_history FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update stock automatically
CREATE OR REPLACE FUNCTION public.update_stock_on_movement()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tool quantities based on movement type
  IF NEW.tipo = 'Entrada' OR NEW.tipo = 'Retorno' THEN
    UPDATE public.tools 
    SET 
      quantidade_disponivel = quantidade_disponivel + NEW.quantidade,
      quantidade_total = quantidade_total + NEW.quantidade
    WHERE id = NEW.tool_id;
  ELSIF NEW.tipo = 'Saída' OR NEW.tipo = 'Reafiamento' THEN
    UPDATE public.tools 
    SET quantidade_disponivel = quantidade_disponivel - NEW.quantidade
    WHERE id = NEW.tool_id;
  ELSIF NEW.tipo = 'Descarte' THEN
    UPDATE public.tools 
    SET 
      quantidade_disponivel = quantidade_disponivel - NEW.quantidade,
      quantidade_total = quantidade_total - NEW.quantidade
    WHERE id = NEW.tool_id;
  END IF;

  -- Insert stock history record
  INSERT INTO public.stock_history (tool_id, movement_id, quantidade_anterior, quantidade_nova, tipo_alteracao)
  VALUES (NEW.tool_id, NEW.id, NEW.quantidade_antes, NEW.quantidade_depois, NEW.tipo);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stock updates
CREATE TRIGGER update_stock_on_movement_trigger
  AFTER INSERT ON public.movements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_stock_on_movement();

-- Insert sample sectors
INSERT INTO public.sectors (nome, descricao, responsavel) VALUES
('Usinagem', 'Setor de usinagem e tornos CNC', 'João Silva'),
('Estoque', 'Controle de estoque central', 'Maria Santos'),
('Qualidade', 'Controle de qualidade', 'Pedro Costa'),
('Tornos CNC', 'Setor de tornos automatizados', 'Ana Oliveira'),
('Produção', 'Linha de produção geral', 'Carlos Mendes');

-- Insert sample tools
INSERT INTO public.tools (codigo, descricao, categoria, quantidade_total, quantidade_disponivel, quantidade_minima, custo_unitario, localizacao) VALUES
('BR001', 'Broca HSS 10mm', 'Brocas', 50, 45, 10, 15.50, 'A1-01'),
('FR001', 'Fresa 25mm Titânio', 'Fresas', 30, 25, 5, 125.00, 'A1-02'),
('ES001', 'Escareador 8mm HSS', 'Escareadores', 25, 17, 5, 45.00, 'A1-03'),
('PA001', 'Pastilha Cerâmica R220', 'Pastilhas', 100, 80, 20, 8.75, 'A2-01'),
('BR002', 'Broca Escalonada 3-12mm', 'Brocas', 15, 12, 3, 89.90, 'A1-04');