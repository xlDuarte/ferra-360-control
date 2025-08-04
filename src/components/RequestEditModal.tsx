import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Requisicao {
  id: string;
  numero: string;
  tipo: string;
  descricao: string;
  solicitante: string;
  setor: string;
  prioridade: string;
  valor: string;
  dataAbertura: string;
  prazo: string;
  status: string;
  aprovador?: string;
  justificativa?: string;
}

interface RequestEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requisicao: Requisicao | null;
  onSave: (requisicao: Requisicao) => void;
}

export function RequestEditModal({ open, onOpenChange, requisicao, onSave }: RequestEditModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tipo: "",
    descricao: "",
    prioridade: "",
    valor: "",
    prazo: "",
    justificativa: "",
    setor: "",
    solicitante: "",
    status: ""
  });

  useEffect(() => {
    if (requisicao) {
      setFormData({
        tipo: requisicao.tipo,
        descricao: requisicao.descricao,
        prioridade: requisicao.prioridade,
        valor: requisicao.valor,
        prazo: requisicao.prazo,
        justificativa: requisicao.justificativa || "",
        setor: requisicao.setor,
        solicitante: requisicao.solicitante,
        status: requisicao.status
      });
    }
  }, [requisicao]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo || !formData.descricao || !formData.prioridade) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (!requisicao) return;

    const updatedRequisicao: Requisicao = {
      ...requisicao,
      tipo: formData.tipo,
      descricao: formData.descricao,
      prioridade: formData.prioridade,
      valor: formData.valor,
      prazo: formData.prazo,
      justificativa: formData.justificativa,
      setor: formData.setor,
      solicitante: formData.solicitante,
      status: formData.status
    };

    onSave(updatedRequisicao);

    toast({
      title: "Sucesso",
      description: `Requisição ${requisicao.numero} atualizada com sucesso!`,
      variant: "default"
    });

    onOpenChange(false);
  };

  if (!requisicao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Requisição {requisicao.numero}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
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
              <Select value={formData.prioridade} onValueChange={(value) => setFormData({...formData, prioridade: value})}>
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="solicitante">Solicitante</Label>
              <Input
                id="solicitante"
                value={formData.solicitante}
                onChange={(e) => setFormData({...formData, solicitante: e.target.value})}
                placeholder="Nome do solicitante"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="setor">Setor</Label>
              <Select value={formData.setor} onValueChange={(value) => setFormData({...formData, setor: value})}>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Estimado</Label>
              <Input
                id="valor"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
                placeholder="R$ 0,00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prazo">Prazo Necessário</Label>
              <Input
                id="prazo"
                type="date"
                value={formData.prazo}
                onChange={(e) => setFormData({...formData, prazo: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Rejeitado">Rejeitado</SelectItem>
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
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}