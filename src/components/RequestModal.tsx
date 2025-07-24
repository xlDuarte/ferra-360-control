import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface RequisicaoData {
  tipo: string;
  descricao: string;
  prioridade: string;
  valor: string;
  prazo: string;
  justificativa: string;
  setor: string;
}

interface RequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<RequisicaoData>;
  readOnly?: boolean;
  title?: string;
}

export function RequestModal({ open, onOpenChange, initialData, readOnly, title }: RequestModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RequisicaoData>({
    tipo: initialData?.tipo || "",
    descricao: initialData?.descricao || "",
    prioridade: initialData?.prioridade || "",
    valor: initialData?.valor || "",
    prazo: initialData?.prazo || "",
    justificativa: initialData?.justificativa || "",
    setor: initialData?.setor || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (readOnly) {
      onOpenChange(false);
      return;
    }

    if (!formData.tipo || !formData.descricao || !formData.prioridade) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Generate PR number
    const prNumber = `PR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;

    toast({
      title: "Sucesso",
      description: initialData ? `Requisição ${prNumber} atualizada` : `Requisição ${prNumber} criada com sucesso!`,
      variant: "default"
    });

    // Reset form
    setFormData({
      tipo: "",
      descricao: "",
      prioridade: "",
      valor: "",
      prazo: "",
      justificativa: "",
      setor: ""
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title || (initialData ? 'Editar Requisição' : 'Nova Requisição')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})} disabled={readOnly}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Compra">Compra</SelectItem>
                  <SelectItem value="Reafiamento">Reafiamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade *</Label>
              <Select value={formData.prioridade} onValueChange={(value) => setFormData({...formData, prioridade: value})} disabled={readOnly}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              placeholder="Descreva os itens ou serviços necessários"
              disabled={readOnly}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Estimado</Label>
              <Input
                id="valor"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
                placeholder="R$ 0,00"
                disabled={readOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prazo">Prazo Necessário</Label>
              <Input
                id="prazo"
                type="date"
                value={formData.prazo}
                onChange={(e) => setFormData({...formData, prazo: e.target.value})}
                disabled={readOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="setor">Setor Solicitante</Label>
              <Select value={formData.setor} onValueChange={(value) => setFormData({...formData, setor: value})} disabled={readOnly}>
                <SelectTrigger>
                  <SelectValue placeholder="Setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Usinagem">Usinagem</SelectItem>
                  <SelectItem value="Tornos CNC">Tornos CNC</SelectItem>
                  <SelectItem value="Montagem">Montagem</SelectItem>
                  <SelectItem value="Qualidade">Qualidade</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="justificativa">Justificativa</Label>
            <Textarea
              id="justificativa"
              value={formData.justificativa}
              onChange={(e) => setFormData({...formData, justificativa: e.target.value})}
              placeholder="Justifique a necessidade desta requisição..."
              rows={3}
              disabled={readOnly}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {readOnly ? 'Fechar' : initialData ? 'Salvar' : 'Criar Requisição'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}