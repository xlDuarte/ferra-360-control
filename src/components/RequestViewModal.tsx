import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Clock, CheckCircle, XCircle, AlertTriangle, User, Building, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface RequestViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requisicao: Requisicao | null;
}

export function RequestViewModal({ open, onOpenChange, requisicao }: RequestViewModalProps) {
  if (!requisicao) return null;

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-destructive/10 text-destructive';
      case 'Média': return 'bg-warning/10 text-warning';
      case 'Baixa': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pendente': return <Clock className="h-4 w-4 text-warning" />;
      case 'Aprovado': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Rejeitado': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'Em Andamento': return <AlertTriangle className="h-4 w-4 text-primary" />;
      case 'Concluído': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes da Requisição
            <Badge variant="outline">{requisicao.numero}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status e Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Status Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getStatusIcon(requisicao.status)}
                  <StatusBadge status={requisicao.status} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge>{requisicao.tipo}</Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Prioridade</CardTitle>
              </CardHeader>
              <CardContent>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(requisicao.prioridade)}`}>
                  {requisicao.prioridade}
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{requisicao.descricao}</p>
            </CardContent>
          </Card>

          {/* Informações do Solicitante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Solicitante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{requisicao.solicitante}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Setor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{requisicao.setor}</p>
              </CardContent>
            </Card>
          </div>

          {/* Informações Financeiras e Prazos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Valor Estimado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-primary">{requisicao.valor}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data de Abertura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{new Date(requisicao.dataAbertura).toLocaleDateString('pt-BR')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Prazo Necessário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{new Date(requisicao.prazo).toLocaleDateString('pt-BR')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Aprovador */}
          {requisicao.aprovador && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Aprovador Responsável</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{requisicao.aprovador}</p>
              </CardContent>
            </Card>
          )}

          {/* Justificativa */}
          {requisicao.justificativa && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Justificativa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{requisicao.justificativa}</p>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}