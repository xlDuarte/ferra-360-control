import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportName?: string;
}

export function EmailReportModal({ isOpen, onClose, reportName }: EmailReportModalProps) {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState(`Relatório: ${reportName || 'Novo Relatório'}`);
  const [message, setMessage] = useState("Segue em anexo o relatório solicitado.\n\nAtenciosamente,\nSistema de Gestão");
  const [includePDF, setIncludePDF] = useState(true);
  const [includeExcel, setIncludeExcel] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!emails.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe pelo menos um email.",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Email Enviado",
      description: `Relatório enviado para ${emails.split(',').length} destinatário(s) com sucesso!`
    });

    setIsSending(false);
    onClose();
  };

  const handleClose = () => {
    setEmails("");
    setSubject(`Relatório: ${reportName || 'Novo Relatório'}`);
    setMessage("Segue em anexo o relatório solicitado.\n\nAtenciosamente,\nSistema de Gestão");
    setIncludePDF(true);
    setIncludeExcel(false);
    setIsSending(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Enviar Relatório por Email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emails">Destinatários</Label>
            <Input
              id="emails"
              type="email"
              placeholder="email1@exemplo.com, email2@exemplo.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separe múltiplos emails com vírgula
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Formatos de Anexo</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pdf"
                  checked={includePDF}
                  onCheckedChange={(checked) => setIncludePDF(checked === true)}
                />
                <Label htmlFor="pdf" className="text-sm">Incluir PDF</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="excel"
                  checked={includeExcel}
                  onCheckedChange={(checked) => setIncludeExcel(checked === true)}
                />
                <Label htmlFor="excel" className="text-sm">Incluir Excel</Label>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Enviando...
                </div>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}