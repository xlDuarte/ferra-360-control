import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, FileText, Download, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportConfig: {
    tipo: string;
    periodo: string;
    dataInicio: string;
    dataFim: string;
  };
  onReportGenerated: (report: any) => void;
}

export function ReportGeneratorModal({ 
  isOpen, 
  onClose, 
  reportConfig, 
  onReportGenerated 
}: ReportGeneratorModalProps) {
  const [status, setStatus] = useState<'generating' | 'completed' | 'error'>('generating');
  const [progress, setProgress] = useState(0);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const generateReport = async () => {
    setStatus('generating');
    setProgress(0);

    // Simular geração do relatório
    const steps = [
      { message: "Coletando dados...", duration: 1000 },
      { message: "Processando informações...", duration: 1500 },
      { message: "Formatando relatório...", duration: 1000 },
      { message: "Finalizando...", duration: 500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Simular dados do relatório gerado
    const report = {
      id: `REP-${Date.now()}`,
      nome: `Relatório de ${reportConfig.tipo} - ${new Date().toLocaleDateString()}`,
      tipo: reportConfig.tipo.charAt(0).toUpperCase() + reportConfig.tipo.slice(1),
      data: new Date().toLocaleDateString(),
      size: `${Math.floor(Math.random() * 3 + 1)}.${Math.floor(Math.random() * 9 + 1)} MB`,
      periodo: reportConfig.periodo,
      dataInicio: reportConfig.dataInicio,
      dataFim: reportConfig.dataFim,
      registros: Math.floor(Math.random() * 500 + 50)
    };

    setGeneratedReport(report);
    setStatus('completed');
    onReportGenerated(report);
  };

  const handleDownload = () => {
    toast({
      title: "Download Iniciado",
      description: `Baixando ${generatedReport.nome}...`
    });
  };

  const handleClose = () => {
    setStatus('generating');
    setProgress(0);
    setGeneratedReport(null);
    onClose();
  };

  // Iniciar geração quando o modal abrir
  useState(() => {
    if (isOpen) {
      generateReport();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Gerando Relatório
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {status === 'generating' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Processando dados...</p>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                {progress}% concluído
              </p>
            </div>
          )}

          {status === 'completed' && generatedReport && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Relatório Gerado com Sucesso!</h3>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome:</span>
                      <span className="font-medium">{generatedReport.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span>{generatedReport.tipo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Período:</span>
                      <span>{generatedReport.periodo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Registros:</span>
                      <span>{generatedReport.registros}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamanho:</span>
                      <span>{generatedReport.size}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Fechar
                </Button>
                <Button className="flex-1" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Erro na Geração</h3>
                <p className="text-muted-foreground">
                  Ocorreu um erro ao gerar o relatório. Tente novamente.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={generateReport}>
                  Tentar Novamente
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}