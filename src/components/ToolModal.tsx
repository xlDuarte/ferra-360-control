import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Tool {
  codigo: string;
  descricao: string;
  fabricante: string;
  quantidade: string;
  localizacao: string;
  dataAquisicao: string;
  vidaUtil: string;
  observacoes: string;
}

interface ToolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Tool>;
  readOnly?: boolean;
  title?: string;
}

export function ToolModal({ open, onOpenChange, initialData, readOnly, title }: ToolModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Tool>({
    codigo: initialData?.codigo || "",
    descricao: initialData?.descricao || "",
    fabricante: initialData?.fabricante || "",
    quantidade: initialData?.quantidade || "",
    localizacao: initialData?.localizacao || "",
    dataAquisicao: initialData?.dataAquisicao || "",
    vidaUtil: initialData?.vidaUtil || "",
    observacoes: initialData?.observacoes || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (readOnly) {
      onOpenChange(false);
      return;
    }

    if (!formData.codigo || !formData.descricao || !formData.fabricante) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: initialData ? "Ferramenta atualizada" : "Ferramenta cadastrada com sucesso!",
      variant: "default",
    });

    setFormData({
      codigo: "",
      descricao: "",
      fabricante: "",
      quantidade: "",
      localizacao: "",
      dataAquisicao: "",
      vidaUtil: "",
      observacoes: "",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title || (initialData ? 'Editar Ferramenta' : 'Nova Ferramenta')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                placeholder="Ex: BR-HSS-10"
                disabled={readOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fabricante">Fabricante *</Label>
              <Input
                id="fabricante"
                value={formData.fabricante}
                onChange={(e) => setFormData({...formData, fabricante: e.target.value})}
                placeholder="Ex: Sandvik"
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              placeholder="Ex: Broca HSS 10mm"
              disabled={readOnly}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                placeholder="0"
                disabled={readOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                value={formData.localizacao}
                onChange={(e) => setFormData({...formData, localizacao: e.target.value})}
                placeholder="Ex: A1-01"
                disabled={readOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataAquisicao">Data Aquisição</Label>
              <Input
                id="dataAquisicao"
                type="date"
                value={formData.dataAquisicao}
                onChange={(e) => setFormData({...formData, dataAquisicao: e.target.value})}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vidaUtil">Vida Útil (meses)</Label>
            <Input
              id="vidaUtil"
              type="number"
              value={formData.vidaUtil}
              onChange={(e) => setFormData({...formData, vidaUtil: e.target.value})}
              placeholder="12"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Informações adicionais..."
              rows={3}
              disabled={readOnly}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {readOnly ? 'Fechar' : initialData ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}