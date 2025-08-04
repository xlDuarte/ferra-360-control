import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  id: string;
  codigo: string;
  descricao: string;
  quantidade_disponivel: number;
  custo_unitario: number;
}

interface Sector {
  id: string;
  nome: string;
}

interface MovementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMovementCreated: () => void;
}

export function MovementModal({ open, onOpenChange, onMovementCreated }: MovementModalProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tool_id: "",
    tipo: "",
    quantidade: "",
    usuario: "",
    sector_id: "",
    setor: "",
    observacoes: ""
  });

  useEffect(() => {
    if (open) {
      loadTools();
      loadSectors();
    }
  }, [open]);

  const loadTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('id, codigo, descricao, quantidade_disponivel, custo_unitario')
        .order('descricao');
      
      if (error) throw error;
      setTools(data || []);
    } catch (error) {
      console.error('Erro ao carregar ferramentas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as ferramentas",
        variant: "destructive"
      });
    }
  };

  const loadSectors = async () => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('id, nome')
        .order('nome');
      
      if (error) throw error;
      setSectors(data || []);
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os setores",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tool_id || !formData.tipo || !formData.quantidade || !formData.usuario || !formData.setor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const quantidade = parseInt(formData.quantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
      toast({
        title: "Erro",
        description: "Quantidade deve ser um número positivo",
        variant: "destructive"
      });
      return;
    }

    const tool = tools.find(t => t.id === formData.tool_id);
    if (!tool) {
      toast({
        title: "Erro",
        description: "Ferramenta não encontrada",
        variant: "destructive"
      });
      return;
    }

    // Verificar se há estoque suficiente para saída/reafiamento
    if ((formData.tipo === 'Saída' || formData.tipo === 'Reafiamento') && 
        tool.quantidade_disponivel < quantidade) {
      toast({
        title: "Erro",
        description: `Estoque insuficiente. Disponível: ${tool.quantidade_disponivel}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Calcular quantidades antes e depois
      let quantidadeAntes = tool.quantidade_disponivel;
      let quantidadeDepois = quantidadeAntes;
      
      if (formData.tipo === 'Entrada' || formData.tipo === 'Retorno') {
        quantidadeDepois = quantidadeAntes + quantidade;
      } else if (formData.tipo === 'Saída' || formData.tipo === 'Reafiamento' || formData.tipo === 'Descarte') {
        quantidadeDepois = quantidadeAntes - quantidade;
      }

      // Calcular custo total
      const custoTotal = quantidade * tool.custo_unitario;

      const { error } = await supabase
        .from('movements')
        .insert({
          tool_id: formData.tool_id,
          tipo: formData.tipo,
          quantidade: quantidade,
          quantidade_antes: quantidadeAntes,
          quantidade_depois: quantidadeDepois,
          usuario: formData.usuario,
          sector_id: formData.sector_id || null,
          setor: formData.setor,
          observacoes: formData.observacoes || null,
          custo_total: custoTotal,
          status: 'Concluído'
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Movimentação registrada com sucesso!"
      });

      // Reset form
      setFormData({
        tool_id: "",
        tipo: "",
        quantidade: "",
        usuario: "",
        sector_id: "",
        setor: "",
        observacoes: ""
      });

      onMovementCreated();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erro ao criar movimentação:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível registrar a movimentação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSectorChange = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    setFormData({
      ...formData,
      sector_id: sectorId,
      setor: sector?.nome || ""
    });
  };

  const selectedTool = tools.find(t => t.id === formData.tool_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Movimentação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tool_id">Ferramenta *</Label>
            <Select value={formData.tool_id} onValueChange={(value) => setFormData({...formData, tool_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma ferramenta" />
              </SelectTrigger>
              <SelectContent>
                {tools.map((tool) => (
                  <SelectItem key={tool.id} value={tool.id}>
                    {tool.codigo} - {tool.descricao} (Disp: {tool.quantidade_disponivel})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTool && (
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
              <p>Disponível: {selectedTool.quantidade_disponivel} unidades</p>
              <p>Custo unitário: R$ {selectedTool.custo_unitario.toFixed(2)}</p>
            </div>
          )}

          <div>
            <Label htmlFor="tipo">Tipo de Movimentação *</Label>
            <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Saída">Saída</SelectItem>
                <SelectItem value="Reafiamento">Reafiamento</SelectItem>
                <SelectItem value="Retorno">Retorno</SelectItem>
                <SelectItem value="Descarte">Descarte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantidade">Quantidade *</Label>
            <Input
              id="quantidade"
              type="number"
              min="1"
              value={formData.quantidade}
              onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
              placeholder="Digite a quantidade"
            />
          </div>

          <div>
            <Label htmlFor="usuario">Usuário Responsável *</Label>
            <Input
              id="usuario"
              value={formData.usuario}
              onChange={(e) => setFormData({...formData, usuario: e.target.value})}
              placeholder="Nome do usuário"
            />
          </div>

          <div>
            <Label htmlFor="setor">Setor *</Label>
            <Select value={formData.sector_id} onValueChange={handleSectorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Observações adicionais (opcional)"
              rows={3}
            />
          </div>

          {formData.quantidade && selectedTool && (
            <div className="text-sm bg-primary/10 p-2 rounded">
              <p><strong>Custo total estimado:</strong> R$ {(parseInt(formData.quantidade || '0') * selectedTool.custo_unitario).toFixed(2)}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Salvando..." : "Registrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}