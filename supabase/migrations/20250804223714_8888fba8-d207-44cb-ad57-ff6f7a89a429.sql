-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_stock_on_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
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
$$;