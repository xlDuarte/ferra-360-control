import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Filter,
  Printer,
  Mail,
  Share2,
  Eye
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ReportViewModal } from "@/components/ReportViewModal";
import { ReportGeneratorModal } from "@/components/ReportGeneratorModal";
import { EmailReportModal } from "@/components/EmailReportModal";

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState("estoque");
  const [periodo, setPeriodo] = useState("mensal");
  const [dataInicio, setDataInicio] = useState("2024-01-01");
  const [dataFim, setDataFim] = useState("2024-01-31");
  
  // Modals state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [generatorModalOpen, setGeneratorModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  
  // Reports data
  const [recentReports, setRecentReports] = useState([
    { nome: "Relatório de Estoque - Janeiro 2024", tipo: "Estoque", data: "2024-01-15", size: "2.3 MB" },
    { nome: "Movimentações Mensais", tipo: "Movimentações", data: "2024-01-10", size: "1.8 MB" },
    { nome: "Requisições Pendentes", tipo: "Requisições", data: "2024-01-08", size: "892 KB" },
    { nome: "Relatório de Usuários", tipo: "Usuários", data: "2024-01-05", size: "1.2 MB" }
  ]);

  const handleGerarRelatorio = () => {
    setGeneratorModalOpen(true);
  };

  const handleExportarPDF = () => {
    // Simular download de PDF
    const link = document.createElement('a');
    link.href = '#';
    link.download = `relatorio-${tipoRelatorio}-${new Date().getTime()}.pdf`;
    link.click();
    
    toast({
      title: "Exportando PDF",
      description: "Download do PDF iniciado com sucesso!"
    });
  };

  const handleExportarExcel = () => {
    // Simular download de Excel
    const link = document.createElement('a');
    link.href = '#';
    link.download = `relatorio-${tipoRelatorio}-${new Date().getTime()}.xlsx`;
    link.click();
    
    toast({
      title: "Exportando Excel",
      description: "Download do Excel iniciado com sucesso!"
    });
  };

  const handleEnviarEmail = () => {
    setEmailModalOpen(true);
  };

  const handleImprimir = () => {
    window.print();
    toast({
      title: "Imprimindo",
      description: "Enviando relatório para impressão..."
    });
  };

  const handleCompartilhar = () => {
    if (navigator.share) {
      navigator.share({
        title: `Relatório de ${tipoRelatorio}`,
        text: `Compartilhando relatório do período ${periodo}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado",
        description: "Link de compartilhamento copiado para a área de transferência!"
      });
    }
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setViewModalOpen(true);
  };

  const handleDownloadReport = (report: any) => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = report.nome.replace(/\s+/g, '-').toLowerCase() + '.pdf';
    link.click();
    
    toast({
      title: "Download Iniciado",
      description: `Baixando ${report.nome}...`
    });
  };

  const handleReportGenerated = (newReport: any) => {
    setRecentReports(prev => [newReport, ...prev]);
    toast({
      title: "Relatório Gerado",
      description: "Novo relatório adicionado à lista de relatórios recentes."
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Geração de relatórios e análises do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleCompartilhar}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
          <Button 
            className="bg-gradient-primary"
            onClick={handleGerarRelatorio}
          >
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Configurações do Relatório */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5 text-primary" />
            Configurações do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Relatório</Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estoque">Estoque</SelectItem>
                  <SelectItem value="movimentacoes">Movimentações</SelectItem>
                  <SelectItem value="requisicoes">Requisições</SelectItem>
                  <SelectItem value="ferramentas">Ferramentas</SelectItem>
                  <SelectItem value="usuarios">Usuários</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo">Período</Label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-inicio">Data Início</Label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-fim">Data Fim</Label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações do Relatório */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Ações do Relatório</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={handleExportarPDF}
            >
              <Download className="h-6 w-6 mb-2" />
              Exportar PDF
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={handleExportarExcel}
            >
              <Download className="h-6 w-6 mb-2" />
              Exportar Excel
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={handleImprimir}
            >
              <Printer className="h-6 w-6 mb-2" />
              Imprimir
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={handleEnviarEmail}
            >
              <Mail className="h-6 w-6 mb-2" />
              Enviar Email
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={handleCompartilhar}
            >
              <Share2 className="h-6 w-6 mb-2" />
              Compartilhar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Relatórios Recentes */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            Relatórios Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((relatorio, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{relatorio.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {relatorio.tipo} • {relatorio.data} • {relatorio.size}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDownloadReport(relatorio)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewReport(relatorio)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-success" />
              Relatórios Gerados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">48</div>
            <p className="text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-warning" />
              Último Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium text-foreground">15/01/2024</div>
            <p className="text-muted-foreground">Relatório de Estoque</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2 h-5 w-5 text-primary" />
              Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">156</div>
            <p className="text-muted-foreground">Total de downloads</p>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ReportViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        report={selectedReport}
      />

      <ReportGeneratorModal
        isOpen={generatorModalOpen}
        onClose={() => setGeneratorModalOpen(false)}
        reportConfig={{
          tipo: tipoRelatorio,
          periodo,
          dataInicio,
          dataFim
        }}
        onReportGenerated={handleReportGenerated}
      />

      <EmailReportModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        reportName={`Relatório de ${tipoRelatorio}`}
      />
    </div>
  );
}