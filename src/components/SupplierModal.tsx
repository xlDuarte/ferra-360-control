import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupplierModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fabricantesDisponiveis = [
  "Sandvik", "Kennametal", "OSG", "Mitsubishi", "Iscar", "Walter", "Yamawa", 
  "Dormer Pramet", "Seco Tools", "Kyocera", "Tungaloy", "Sumitomo"
];

const estadosBrasil = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export function SupplierModal({ open, onOpenChange }: SupplierModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    pessoaContato: "",
    telefone: "",
    email: "",
    whatsapp: false,
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    status: "Ativo",
    observacoes: ""
  });

  const [fabricantesSelecionados, setFabricantesSelecionados] = useState<string[]>([]);
  const [novoFabricante, setNovoFabricante] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.cnpj || !formData.pessoaContato || !formData.telefone || !formData.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (fabricantesSelecionados.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um fabricante",
        variant: "destructive"
      });
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erro",
        description: "Digite um email válido",
        variant: "destructive"
      });
      return;
    }

    // Validação de CNPJ (formato básico)
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!cnpjRegex.test(formData.cnpj)) {
      toast({
        title: "Erro",
        description: "Digite um CNPJ válido (00.000.000/0000-00)",
        variant: "destructive"
      });
      return;
    }

    // Aqui seria enviado para API
    toast({
      title: "Sucesso",
      description: "Fornecedor cadastrado com sucesso!",
      variant: "default"
    });

    // Reset form
    setFormData({
      nome: "",
      cnpj: "",
      pessoaContato: "",
      telefone: "",
      email: "",
      whatsapp: false,
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      status: "Ativo",
      observacoes: ""
    });
    setFabricantesSelecionados([]);
    setNovoFabricante("");

    onOpenChange(false);
  };

  const adicionarFabricante = (fabricante: string) => {
    if (fabricante && !fabricantesSelecionados.includes(fabricante)) {
      setFabricantesSelecionados([...fabricantesSelecionados, fabricante]);
    }
    setNovoFabricante("");
  };

  const removerFabricante = (fabricante: string) => {
    setFabricantesSelecionados(fabricantesSelecionados.filter(f => f !== fabricante));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Fornecedor</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Sandvik do Brasil"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações de Contato</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pessoaContato">Pessoa de Contato *</Label>
                <Input
                  id="pessoaContato"
                  value={formData.pessoaContato}
                  onChange={(e) => setFormData({...formData, pessoaContato: e.target.value})}
                  placeholder="Ex: Carlos Silva"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(11) 3456-7890"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contato@fornecedor.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="whatsapp"
                    checked={formData.whatsapp}
                    onCheckedChange={(checked) => setFormData({...formData, whatsapp: checked})}
                  />
                  <Label htmlFor="whatsapp" className="text-sm">
                    {formData.whatsapp ? "Possui WhatsApp" : "Não possui WhatsApp"}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endereço</h3>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                placeholder="Rua, número, bairro"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  placeholder="São Paulo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosBrasil.map((estado) => (
                      <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData({...formData, cep: e.target.value})}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Fabricantes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fabricantes Representados *</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fabricante">Adicionar Fabricante</Label>
                <Select value={novoFabricante} onValueChange={setNovoFabricante}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fabricante" />
                  </SelectTrigger>
                  <SelectContent>
                    {fabricantesDisponiveis
                      .filter(fab => !fabricantesSelecionados.includes(fab))
                      .map((fabricante) => (
                        <SelectItem key={fabricante} value={fabricante}>{fabricante}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => adicionarFabricante(novoFabricante)}
                  disabled={!novoFabricante}
                >
                  Adicionar
                </Button>
              </div>
            </div>

            {fabricantesSelecionados.length > 0 && (
              <div className="space-y-2">
                <Label>Fabricantes Selecionados:</Label>
                <div className="flex flex-wrap gap-2">
                  {fabricantesSelecionados.map((fabricante) => (
                    <Badge key={fabricante} variant="secondary" className="flex items-center gap-1">
                      {fabricante}
                      <button
                        type="button"
                        onClick={() => removerFabricante(fabricante)}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              placeholder="Informações adicionais sobre o fornecedor..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              Cadastrar Fornecedor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}