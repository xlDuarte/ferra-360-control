import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package, Search, Eye, Edit, AlertTriangle, Trash2, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/StatusBadge";
import { StockModal } from "@/components/StockModal";
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

interface StockItem {
  id: string;
  codigo: string;
  descricao: string;
  fabricante: string;
  qtdTotal: number;
  qtdDisponivel: number;
  localizacao: string;
  status: "Ativo" | "Manutenção" | "Descartado";
  estoqueMinimo: number;
  valorUnitario?: number;
  custoTotal?: number;
}


const Estoque = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [alertasFilter, setAlertasFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [estoque, setEstoque] = useState<StockItem[]>([
    { id: "1", codigo: "FRZ-001", descricao: "Fresa de Topo 10mm HSS", fabricante: "Sandvik", qtdTotal: 50, qtdDisponivel: 35, localizacao: "A1-B3", status: "Ativo", estoqueMinimo: 10, valorUnitario: 85.50, custoTotal: 4275.00 },
    { id: "2", codigo: "BRC-105", descricao: "Broca Helicoidal 8mm", fabricante: "OSG", qtdTotal: 25, qtdDisponivel: 8, localizacao: "A2-C1", status: "Ativo", estoqueMinimo: 15, valorUnitario: 45.00, custoTotal: 1125.00 },
    { id: "3", codigo: "INS-220", descricao: "Inserto CNMG 120408", fabricante: "Kennametal", qtdTotal: 100, qtdDisponivel: 12, localizacao: "B1-A2", status: "Ativo", estoqueMinimo: 20, valorUnitario: 12.80, custoTotal: 1280.00 },
    { id: "4", codigo: "FRZ-025", descricao: "Fresa Ball Nose 6mm", fabricante: "Mitsubishi", qtdTotal: 30, qtdDisponivel: 0, localizacao: "A1-C2", status: "Manutenção", estoqueMinimo: 5, valorUnitario: 125.00, custoTotal: 3750.00 },
  ]);

  const handleViewItem = (item: StockItem) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEditItem = (item: StockItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteItem = (item: StockItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveItem = (itemData: Partial<StockItem>) => {
    if (selectedItem) {
      // Editar item existente
      setEstoque(estoque.map(item => 
        item.id === selectedItem.id 
          ? { ...item, ...itemData }
          : item
      ));
    } else {
      // Criar novo item
      const newItem: StockItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...itemData as StockItem
      };
      setEstoque([...estoque, newItem]);
    }
  };

  const confirmDelete = () => {
    if (selectedItem) {
      setEstoque(estoque.filter(item => item.id !== selectedItem.id));
      toast({
        title: "Item Excluído",
        description: `Item ${selectedItem.codigo} foi excluído com sucesso.`,
        variant: "destructive"
      });
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const filteredEstoque = estoque.filter(item => {
    const matchesSearch = item.codigo.toLowerCase().includes(search.toLowerCase()) ||
                         item.descricao.toLowerCase().includes(search.toLowerCase()) ||
                         item.fabricante.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    const hasAlert = item.qtdDisponivel <= item.estoqueMinimo;
    const matchesAlerta = alertasFilter === "all" || 
                         (alertasFilter === "critico" && hasAlert) ||
                         (alertasFilter === "normal" && !hasAlert);
    
    return matchesSearch && matchesStatus && matchesAlerta;
  });

  const alertasCriticos = estoque.filter(item => item.qtdDisponivel <= item.estoqueMinimo).length;
  const totalItens = estoque.length;
  const valorTotalEstoque = estoque.reduce((acc, item) => acc + (item.custoTotal || 0), 0);
  const valorEstoqueDisponivel = estoque.reduce((acc, item) => acc + ((item.valorUnitario || 0) * item.qtdDisponivel), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Controle de Estoque</h1>
          <p className="text-muted-foreground">Gestão completa dos níveis de estoque</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
          <Package className="mr-2 h-4 w-4" />
          Cadastrar Item
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItens}</div>
            <p className="text-xs text-muted-foreground">tipos de ferramentas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Estoque</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">investimento total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{alertasCriticos}</div>
            <p className="text-xs text-muted-foreground">itens abaixo do mínimo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Disponível</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {valorEstoqueDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">valor para produção</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código, descrição ou fabricante..."
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
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Descartado">Descartado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={alertasFilter} onValueChange={setAlertasFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Alertas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="critico">Críticos</SelectItem>
                <SelectItem value="normal">Normais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Estoque */}
      <Card>
        <CardHeader>
          <CardTitle>Itens em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Fabricante</TableHead>
                <TableHead className="text-center">Qtd Total</TableHead>
                <TableHead className="text-center">Disponível</TableHead>
                <TableHead className="text-center">Mínimo</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Alerta</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstoque.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.codigo}</TableCell>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell>{item.fabricante}</TableCell>
                  <TableCell className="text-center">{item.qtdTotal}</TableCell>
                  <TableCell className="text-center">{item.qtdDisponivel}</TableCell>
                  <TableCell className="text-center">{item.estoqueMinimo}</TableCell>
                  <TableCell className="text-right">
                    {item.valorUnitario ? `R$ ${item.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.custoTotal ? `R$ ${item.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
                  </TableCell>
                  <TableCell>{item.localizacao}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    {item.qtdDisponivel <= item.estoqueMinimo && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Crítico
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewItem(item)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditItem(item)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteItem(item)}
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

      {/* Modal de Cadastro */}
      <StockModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        mode="create"
        onSave={handleSaveItem}
      />

      {/* Modal de Edição */}
      <StockModal 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen}
        item={selectedItem || undefined}
        mode="edit"
        onSave={handleSaveItem}
      />

      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Código</Label>
                  <p className="text-foreground font-mono">{selectedItem.codigo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Fabricante</Label>
                  <p className="text-foreground">{selectedItem.fabricante}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
                <p className="text-foreground">{selectedItem.descricao}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Quantidade Total</Label>
                  <p className="text-foreground font-bold">{selectedItem.qtdTotal}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Disponível</Label>
                  <p className="text-foreground font-bold text-primary">{selectedItem.qtdDisponivel}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estoque Mínimo</Label>
                  <p className="text-foreground">{selectedItem.estoqueMinimo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Localização</Label>
                  <p className="text-foreground">{selectedItem.localizacao}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={selectedItem.status} />
                  </div>
                </div>
              </div>
              {selectedItem.qtdDisponivel <= selectedItem.estoqueMinimo && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                    <span className="text-amber-800 font-medium">Alerta de Estoque Crítico</span>
                  </div>
                  <p className="text-amber-700 text-sm mt-1">
                    Este item está abaixo do estoque mínimo. Considere fazer uma nova compra.
                  </p>
                </div>
              )}
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
              Tem certeza que deseja excluir o item{" "}
              <span className="font-medium">{selectedItem?.codigo}</span>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedItem(null)}>
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
};

export default Estoque;