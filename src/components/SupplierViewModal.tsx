import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Calendar,
  FileText,
  Edit,
  Trash2,
  Copy
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  nome: string;
  cnpj: string;
  pessoaContato: string;
  telefone: string;
  email: string;
  whatsapp: boolean;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  fabricantes: string[];
  status: "Ativo" | "Inativo";
  dataRegistro: string;
  observacoes?: string;
}

interface SupplierViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}

export function SupplierViewModal({ 
  isOpen, 
  onClose, 
  supplier, 
  onEdit, 
  onDelete 
}: SupplierViewModalProps) {
  if (!supplier) return null;

  const handleCopyInfo = (info: string, label: string) => {
    navigator.clipboard.writeText(info);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`
    });
  };

  const handleWhatsApp = () => {
    if (supplier.whatsapp) {
      const phone = supplier.telefone.replace(/\D/g, '');
      window.open(`https://wa.me/55${phone}`, '_blank');
    }
  };

  const handleEmail = () => {
    window.open(`mailto:${supplier.email}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${supplier.telefone}`, '_blank');
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o fornecedor ${supplier.nome}?`)) {
      onDelete(supplier.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Detalhes do Fornecedor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Principais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-primary" />
                  {supplier.nome}
                </div>
                <Badge variant={supplier.status === "Ativo" ? "default" : "secondary"}>
                  {supplier.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                    <div className="flex items-center gap-2">
                      <p className="text-foreground">{supplier.cnpj}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyInfo(supplier.cnpj, "CNPJ")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Registro</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">
                        {new Date(supplier.dataRegistro).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fabricantes Representados</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {supplier.fabricantes.map((fab, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {fab}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-primary" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pessoa de Contato</p>
                    <p className="text-foreground font-medium">{supplier.pessoaContato}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{supplier.telefone}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCall}
                      >
                        Ligar
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-foreground">{supplier.email}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEmail}
                      >
                        Enviar
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                    <div className="flex items-center gap-2">
                      <MessageCircle className={`h-4 w-4 ${supplier.whatsapp ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <p className="text-foreground">
                        {supplier.whatsapp ? 'Disponível' : 'Não disponível'}
                      </p>
                      {supplier.whatsapp && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleWhatsApp}
                          className="text-green-600"
                        >
                          Conversar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-foreground">{supplier.endereco}</p>
                <p className="text-foreground">
                  {supplier.cidade} - {supplier.estado}
                </p>
                <p className="text-muted-foreground">CEP: {supplier.cep}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const address = `${supplier.endereco}, ${supplier.cidade} - ${supplier.estado}, ${supplier.cep}`;
                    window.open(`https://maps.google.com/maps?q=${encodeURIComponent(address)}`, '_blank');
                  }}
                >
                  <MapPin className="mr-2 h-3 w-3" />
                  Ver no Mapa
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {supplier.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">{supplier.observacoes}</p>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
            <Button onClick={() => onEdit(supplier)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}