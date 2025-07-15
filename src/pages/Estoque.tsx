import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Search, Eye, Edit, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { ToolModal } from "@/components/ToolModal";

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
}

const mockEstoque: StockItem[] = [
  { id: "1", codigo: "FRZ-001", descricao: "Fresa de Topo 10mm HSS", fabricante: "Sandvik", qtdTotal: 50, qtdDisponivel: 35, localizacao: "A1-B3", status: "Ativo", estoqueMinimo: 10 },
  { id: "2", codigo: "BRC-105", descricao: "Broca Helicoidal 8mm", fabricante: "OSG", qtdTotal: 25, qtdDisponivel: 8, localizacao: "A2-C1", status: "Ativo", estoqueMinimo: 15 },
  { id: "3", codigo: "INS-220", descricao: "Inserto CNMG 120408", fabricante: "Kennametal", qtdTotal: 100, qtdDisponivel: 12, localizacao: "B1-A2", status: "Ativo", estoqueMinimo: 20 },
  { id: "4", codigo: "FRZ-025", descricao: "Fresa Ball Nose 6mm", fabricante: "Mitsubishi", qtdTotal: 30, qtdDisponivel: 0, localizacao: "A1-C2", status: "Manutenção", estoqueMinimo: 5 },
];

const Estoque = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [alertasFilter, setAlertasFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEstoque = mockEstoque.filter(item => {
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

  const alertasCriticos = mockEstoque.filter(item => item.qtdDisponivel <= item.estoqueMinimo).length;
  const totalItens = mockEstoque.length;
  const valorTotalEstoque = mockEstoque.reduce((acc, item) => acc + item.qtdTotal, 0);

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
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{valorTotalEstoque}</div>
            <p className="text-xs text-muted-foreground">unidades em estoque</p>
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
            <CardTitle className="text-sm font-medium">Taxa de Giro</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">do estoque em movimento</p>
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
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ToolModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </div>
  );
};

export default Estoque;