import { useState } from "react";
import { Plus, Search, Filter, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { ToolModal } from "@/components/ToolModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ferramenta {
  id: string;
  codigo: string;
  descricao: string;
  fabricante: string;
  status: string;
  quantidade: number;
  disponivel: number;
  localizacao: string;
  dataAquisicao: string;
}

export default function Ferramentas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Ferramenta | null>(null);
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([
    {
      id: "1",
      codigo: "BR-HSS-10",
      descricao: "Broca HSS 10mm",
      fabricante: "Sandvik",
      status: "Ativo",
      quantidade: 50,
      disponivel: 32,
      localizacao: "A1-01",
      dataAquisicao: "2024-01-15"
    },
    {
      id: "2", 
      codigo: "FR-25-TI",
      descricao: "Fresa 25mm Titânio",
      fabricante: "Kennametal",
      status: "Em Reafiamento",
      quantidade: 15,
      disponivel: 10,
      localizacao: "A2-05",
      dataAquisicao: "2024-02-10"
    },
    {
      id: "3",
      codigo: "ESC-8-HSS",
      descricao: "Escareador 8mm HSS", 
      fabricante: "Walter",
      status: "Ativo",
      quantidade: 25,
      disponivel: 25,
      localizacao: "B1-12",
      dataAquisicao: "2024-01-20"
    }
  ]);

  const handleViewTool = (ferramenta: Ferramenta) => {
    setSelectedTool(ferramenta);
    setIsViewModalOpen(true);
  };

  const handleEditTool = (ferramenta: Ferramenta) => {
    setSelectedTool(ferramenta);
    setIsEditModalOpen(true);
  };

  const handleDeleteTool = (ferramenta: Ferramenta) => {
    setSelectedTool(ferramenta);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTool) {
      setFerramentas(ferramentas.filter(f => f.id !== selectedTool.id));
      toast({
        title: "Ferramenta Excluída",
        description: `Ferramenta ${selectedTool.codigo} foi excluída com sucesso.`,
        variant: "destructive"
      });
      setIsDeleteDialogOpen(false);
      setSelectedTool(null);
    }
  };

  const filteredFerramentas = ferramentas.filter(ferramenta => {
    const matchesSearch = ferramenta.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ferramenta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ferramenta.fabricante.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || ferramenta.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ferramentas</h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro de ferramentas
          </p>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ferramenta
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por código, descrição ou fabricante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Em Reafiamento">Em Reafiamento</SelectItem>
                <SelectItem value="Descartada">Descartada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <p className="text-xs text-muted-foreground">Total de Ferramentas</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">982</div>
            <p className="text-xs text-muted-foreground">Ativas</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">45</div>
            <p className="text-xs text-muted-foreground">Em Reafiamento</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">220</div>
            <p className="text-xs text-muted-foreground">Descartadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lista de Ferramentas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Fabricante</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Qtd Total</TableHead>
                <TableHead>Disponível</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFerramentas.map((ferramenta) => (
                <TableRow key={ferramenta.id}>
                  <TableCell className="font-medium">{ferramenta.codigo}</TableCell>
                  <TableCell>{ferramenta.descricao}</TableCell>
                  <TableCell>{ferramenta.fabricante}</TableCell>
                  <TableCell>
                    <StatusBadge status={ferramenta.status} />
                  </TableCell>
                  <TableCell>{ferramenta.quantidade}</TableCell>
                  <TableCell className="font-medium">{ferramenta.disponivel}</TableCell>
                  <TableCell>{ferramenta.localizacao}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewTool(ferramenta)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditTool(ferramenta)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteTool(ferramenta)}
                        title="Excluir"
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
      
      <ToolModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      
      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Ferramenta</DialogTitle>
          </DialogHeader>
          {selectedTool && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Código</label>
                  <p className="text-foreground">{selectedTool.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fabricante</label>
                  <p className="text-foreground">{selectedTool.fabricante}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                <p className="text-foreground">{selectedTool.descricao}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Quantidade Total</label>
                  <p className="text-foreground">{selectedTool.quantidade}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Disponível</label>
                  <p className="text-foreground font-medium">{selectedTool.disponivel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Localização</label>
                  <p className="text-foreground">{selectedTool.localizacao}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <StatusBadge status={selectedTool.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Aquisição</label>
                  <p className="text-foreground">{new Date(selectedTool.dataAquisicao).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Ferramenta</DialogTitle>
          </DialogHeader>
          {selectedTool && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Editando ferramenta: <span className="font-medium">{selectedTool.codigo}</span>
              </p>
              <Button 
                className="w-full" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  toast({
                    title: "Funcionalidade em Desenvolvimento",
                    description: "A edição completa será implementada em breve.",
                  });
                }}
              >
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a ferramenta{" "}
              <span className="font-medium">{selectedTool?.codigo}</span>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedTool(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}