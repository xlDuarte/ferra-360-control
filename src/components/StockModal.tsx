import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface StockItem {
  id: string;
  codigo: string;
  descricao: string;
  fabricante: string;
  qtdTotal: number;
  qtdDisponivel: number;
  localizacao: string;
  status: "Ativo" | "Manutenção" | "Descartado";
  estoqueMinimo: number;
}

interface StockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: StockItem;
  mode: "create" | "edit";
  onSave?: (item: Partial<StockItem>) => void;
}

export function StockModal({ open, onOpenChange, item, mode, onSave }: StockModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    codigo: item?.codigo || "",
    descricao: item?.descricao || "",
    fabricante: item?.fabricante || "",
    qtdTotal: item?.qtdTotal || 0,
    qtdDisponivel: item?.qtdDisponivel || 0,
    localizacao: item?.localizacao || "",
    status: item?.status || "Ativo" as const,
    estoqueMinimo: item?.estoqueMinimo || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.codigo || !formData.descricao || !formData.fabricante) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (formData.qtdDisponivel > formData.qtdTotal) {
      toast({
        title: "Erro",
        description: "Quantidade disponível não pode ser maior que quantidade total",
        variant: "destructive"
      });
      return;
    }

    onSave?.(formData);

    toast({
      title: mode === "create" ? "Item Cadastrado" : "Item Atualizado",
      description: `Item ${formData.codigo} foi ${mode === "create" ? "cadastrado" : "atualizado"} com sucesso!`,
    });

    // Reset form se for criação
    if (mode === "create") {
      setFormData({
        codigo: "",
        descricao: "",
        fabricante: "",
        qtdTotal: 0,
        qtdDisponivel: 0,
        localizacao: "",
        status: "Ativo",
        estoqueMinimo: 0
      });
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Cadastrar Item no Estoque" : "Editar Item do Estoque"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                placeholder="Ex: FRZ-001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fabricante">Fabricante *</Label>
              <Input
                id="fabricante"
                value={formData.fabricante}
                onChange={(e) => setFormData({...formData, fabricante: e.target.value})}
                placeholder="Ex: Sandvik"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              placeholder="Ex: Fresa de Topo 10mm HSS"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="qtdTotal">Quantidade Total</Label>
              <Input
                id="qtdTotal"
                type="number"
                value={formData.qtdTotal}
                onChange={(e) => setFormData({...formData, qtdTotal: parseInt(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="qtdDisponivel">Quantidade Disponível</Label>
              <Input
                id="qtdDisponivel"
                type="number"
                value={formData.qtdDisponivel}
                onChange={(e) => setFormData({...formData, qtdDisponivel: parseInt(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
              <Input
                id="estoqueMinimo"
                type="number"
                value={formData.estoqueMinimo}
                onChange={(e) => setFormData({...formData, estoqueMinimo: parseInt(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                value={formData.localizacao}
                onChange={(e) => setFormData({...formData, localizacao: e.target.value})}
                placeholder="Ex: A1-B3"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: "Ativo" | "Manutenção" | "Descartado") => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Descartado">Descartado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {mode === "create" ? "Cadastrar" : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}