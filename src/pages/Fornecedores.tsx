import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Search, Eye, Edit, Trash2, UserPlus, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SupplierModal } from "@/components/SupplierModal";
import { SupplierViewModal } from "@/components/SupplierViewModal";
import { SupplierEditModal } from "@/components/SupplierEditModal";

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

const mockFornecedores: Supplier[] = [
  {
    id: "1",
    nome: "Sandvik do Brasil",
    cnpj: "12.345.678/0001-90",
    pessoaContato: "Carlos Silva",
    telefone: "(11) 3456-7890",
    email: "carlos.silva@sandvik.com",
    whatsapp: true,
    endereco: "Av. Industrial, 1000",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    fabricantes: ["Sandvik", "Walter"],
    status: "Ativo",
    dataRegistro: "2023-01-15",
    observacoes: "Fornecedor premium - prazo de entrega 7 dias"
  },
  {
    id: "2",
    nome: "Kennametal Brasil",
    cnpj: "23.456.789/0001-01",
    pessoaContato: "Ana Santos",
    telefone: "(11) 2345-6789",
    email: "ana.santos@kennametal.com",
    whatsapp: false,
    endereco: "Rua Metalúrgica, 500",
    cidade: "Guarulhos",
    estado: "SP",
    cep: "07123-456",
    fabricantes: ["Kennametal"],
    status: "Ativo",
    dataRegistro: "2023-02-20",
    observacoes: "Especialista em pastilhas cerâmicas"
  },
  {
    id: "3",
    nome: "OSG South America",
    cnpj: "34.567.890/0001-12",
    pessoaContato: "Roberto Lima",
    telefone: "(11) 4567-8901",
    email: "roberto.lima@osg.com",
    whatsapp: true,
    endereco: "Av. das Ferramentas, 250",
    cidade: "São Bernardo do Campo",
    estado: "SP",
    cep: "09876-543",
    fabricantes: ["OSG", "Yamawa"],
    status: "Ativo",
    dataRegistro: "2023-03-10"
  },
  {
    id: "4",
    nome: "Mitsubishi Materials",
    cnpj: "45.678.901/0001-23",
    pessoaContato: "Maria Oliveira",
    telefone: "(11) 5678-9012",
    email: "maria.oliveira@mitsubishi.com",
    whatsapp: false,
    endereco: "Rua Tecnológica, 750",
    cidade: "Santo André",
    estado: "SP",
    cep: "09123-789",
    fabricantes: ["Mitsubishi"],
    status: "Inativo",
    dataRegistro: "2023-04-05",
    observacoes: "Fornecedor temporariamente suspenso"
  },
  {
    id: "5",
    nome: "Iscar Brasil",
    cnpj: "56.789.012/0001-34",
    pessoaContato: "Pedro Costa",
    telefone: "(11) 6789-0123",
    email: "pedro.costa@iscar.com",
    whatsapp: true,
    endereco: "Av. Corte e Usinagem, 300",
    cidade: "Diadema",
    estado: "SP",
    cep: "09999-000",
    fabricantes: ["Iscar"],
    status: "Ativo",
    dataRegistro: "2023-05-12"
  }
];

const Fornecedores = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [estadoFilter, setEstadoFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modals state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  // Suppliers data state
  const [fornecedores, setFornecedores] = useState<Supplier[]>(mockFornecedores);

  const filteredFornecedores = fornecedores.filter(supplier => {
    const matchesSearch = supplier.nome.toLowerCase().includes(search.toLowerCase()) ||
                         supplier.pessoaContato.toLowerCase().includes(search.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(search.toLowerCase()) ||
                         supplier.fabricantes.some(fab => fab.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter;
    const matchesEstado = estadoFilter === "all" || supplier.estado === estadoFilter;
    
    return matchesSearch && matchesStatus && matchesEstado;
  });

  const totalFornecedores = fornecedores.length;
  const fornecedoresAtivos = fornecedores.filter(f => f.status === "Ativo").length;
  const fornecedoresInativos = fornecedores.filter(f => f.status === "Inativo").length;
  const fabricantesUnicos = Array.from(new Set(fornecedores.flatMap(f => f.fabricantes))).length;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Ativo": return "default";
      case "Inativo": return "secondary";
      default: return "secondary";
    }
  };

  // Handler functions
  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setViewModalOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEditModalOpen(true);
  };

  const handleSaveSupplier = (updatedSupplier: Supplier) => {
    setFornecedores(prev => 
      prev.map(supplier => 
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      )
    );
    toast({
      title: "Fornecedor Atualizado",
      description: `${updatedSupplier.nome} foi atualizado com sucesso.`
    });
  };

  const handleDeleteSupplier = (supplierId: string) => {
    const supplier = fornecedores.find(s => s.id === supplierId);
    setFornecedores(prev => prev.filter(s => s.id !== supplierId));
    toast({
      title: "Fornecedor Excluído",
      description: `${supplier?.nome} foi excluído com sucesso.`,
      variant: "destructive"
    });
  };

  const handleNewSupplier = (newSupplier: Supplier) => {
    setFornecedores(prev => [...prev, newSupplier]);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Fornecedores</h1>
          <p className="text-muted-foreground">Controle de fornecedores e informações de contato</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Fornecedores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFornecedores}</div>
            <p className="text-xs text-muted-foreground">fornecedores cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores Ativos</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{fornecedoresAtivos}</div>
            <p className="text-xs text-muted-foreground">em operação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <Building2 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{fornecedoresInativos}</div>
            <p className="text-xs text-muted-foreground">fornecedores suspensos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fabricantes</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{fabricantesUnicos}</div>
            <p className="text-xs text-muted-foreground">marcas representadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, contato, email ou fabricante..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estados</SelectItem>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Fornecedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Fabricantes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFornecedores.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.nome}</div>
                      <div className="text-sm text-muted-foreground">{supplier.cnpj}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">{supplier.pessoaContato}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {supplier.telefone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {supplier.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {supplier.whatsapp ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <MessageCircle className="h-3 w-3" />
                        Sim
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Não</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <div className="text-sm">{supplier.cidade}</div>
                        <div className="text-xs text-muted-foreground">{supplier.estado}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {supplier.fabricantes.map((fab, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {fab}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(supplier.status)}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewSupplier(supplier)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          if (window.confirm(`Tem certeza que deseja excluir o fornecedor ${supplier.nome}?`)) {
                            handleDeleteSupplier(supplier.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SupplierModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />

      <SupplierViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        supplier={selectedSupplier}
        onEdit={handleEditSupplier}
        onDelete={handleDeleteSupplier}
      />

      <SupplierEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        supplier={selectedSupplier}
        onSave={handleSaveSupplier}
      />
    </div>
  );
};

export default Fornecedores;