import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

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
}

interface RequestApprovalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requisicao: Requisicao | null;
  onApprove: (requisicao: Requisicao, observacoes: string) => void;
  onReject: (requisicao: Requisicao, observacoes: string) => void;
}

export function RequestApprovalModal({ 
  open, 
  onOpenChange, 
  requisicao, 
  onApprove, 
  onReject 
}: RequestApprovalModalProps) {
  const { toast } = useToast();
  const [observacoes, setObservacoes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    if (!requisicao) return;
    
    setIsSubmitting(true);
    
    try {
      onApprove(requisicao, observacoes);
      
      toast({
        title: "Requisição Aprovada",
        description: `A requisição ${requisicao.numero} foi aprovada com sucesso!`,
        variant: "default"
      });
      
      setObservacoes("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!requisicao) return;
    
    if (!observacoes.trim()) {
      toast({
        title: "Observações Obrigatórias",
        description: "Por favor, informe o motivo da rejeição.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onReject(requisicao, observacoes);
      
      toast({
        title: "Requisição Rejeitada",
        description: `A requisição ${requisicao.numero} foi rejeitada.`,
        variant: "destructive"
      });
      
      setObservacoes("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!requisicao) return null;

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-destructive/10 text-destructive';
      case 'Média': return 'bg-warning/10 text-warning';
      case 'Baixa': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Análise de Requisição
            <Badge variant="outline">{requisicao.numero}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Resumo da Requisição */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <Badge>{requisicao.tipo}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prioridade</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(requisicao.prioridade)}`}>
                  {requisicao.prioridade}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Descrição</p>
              <p className="font-medium">{requisicao.descricao}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Solicitante</p>
                <p className="font-medium">{requisicao.solicitante}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Setor</p>
                <p className="font-medium">{requisicao.setor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="font-bold text-primary">{requisicao.valor}</p>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">
              Observações da Análise
              <span className="text-muted-foreground text-sm ml-1">
                (obrigatório para rejeição)
              </span>
            </Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Adicione comentários sobre a análise desta requisição..."
              rows={4}
            />
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            
            <Button 
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Rejeitar
            </Button>
            
            <Button 
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-success hover:bg-success/90 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Aprovar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}