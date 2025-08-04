import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer, Mail, Share2, FileText, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReportViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    nome: string;
    tipo: string;
    data: string;
    size: string;
  } | null;
}

export function ReportViewModal({ isOpen, onClose, report }: ReportViewModalProps) {
  if (!report) return null;

  const handleDownload = () => {
    toast({
      title: "Download Iniciado",
      description: `Baixando ${report.nome}...`
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Imprimindo",
      description: "Enviando relatório para impressão..."
    });
  };

  const handleEmail = () => {
    toast({
      title: "Enviando por Email",
      description: "Relatório será enviado para seu email em instantes..."
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: report.nome,
        text: `Compartilhando relatório: ${report.nome}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado",
        description: "Link do relatório copiado para a área de transferência!"
      });
    }
  };

  // Mock data baseado no tipo de relatório
  const getMockData = () => {
    switch (report.tipo.toLowerCase()) {
      case 'estoque':
        return [
          { item: "Furadeira Black & Decker", categoria: "Ferramentas", quantidade: 15, status: "Disponível" },
          { item: "Parafusos Phillips M6", categoria: "Fixadores", quantidade: 250, status: "Disponível" },
          { item: "Martelo Tramontina", categoria: "Ferramentas", quantidade: 3, status: "Crítico" },
          { item: "Chaves de Fenda", categoria: "Ferramentas", quantidade: 8, status: "Disponível" }
        ];
      case 'movimentações':
        return [
          { data: "15/01/2024", tipo: "Entrada", item: "Furadeira", quantidade: 5, responsavel: "João Silva" },
          { data: "14/01/2024", tipo: "Saída", item: "Parafusos", quantidade: 50, responsavel: "Maria Santos" },
          { data: "13/01/2024", tipo: "Entrada", item: "Martelo", quantidade: 2, responsavel: "Pedro Lima" },
          { data: "12/01/2024", tipo: "Saída", item: "Chaves", quantidade: 3, responsavel: "Ana Costa" }
        ];
      case 'requisições':
        return [
          { id: "REQ-001", solicitante: "João Silva", item: "Furadeira", quantidade: 1, status: "Aprovada" },
          { id: "REQ-002", solicitante: "Maria Santos", item: "Parafusos", quantidade: 20, status: "Pendente" },
          { id: "REQ-003", solicitante: "Pedro Lima", item: "Martelo", quantidade: 1, status: "Rejeitada" },
          { id: "REQ-004", solicitante: "Ana Costa", item: "Chaves", quantidade: 2, status: "Aprovada" }
        ];
      default:
        return [];
    }
  };

  const data = getMockData();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            {report.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Relatório */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                Informações do Relatório
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Tipo</p>
                  <p className="text-foreground">{report.tipo}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Data de Geração</p>
                  <p className="text-foreground">{report.data}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Tamanho</p>
                  <p className="text-foreground">{report.size}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Total de Registros</p>
                  <p className="text-foreground">{data.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Relatório */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Relatório</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {report.tipo.toLowerCase() === 'estoque' && (
                      <>
                        <TableHead>Item</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Status</TableHead>
                      </>
                    )}
                    {report.tipo.toLowerCase() === 'movimentações' && (
                      <>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Responsável</TableHead>
                      </>
                    )}
                    {report.tipo.toLowerCase() === 'requisições' && (
                      <>
                        <TableHead>ID</TableHead>
                        <TableHead>Solicitante</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Status</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <TableCell key={cellIndex}>{String(value)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
            <Button variant="outline" onClick={handleEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar Email
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Baixar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}