import { useState } from "react";
import { Plus, Search, Filter, ArrowUpDown, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Movimentacao {
  id: string;
  ferramenta: string;
  tipo: string;
  quantidade: number;
  usuario: string;
  setor: string;
  dataHora: string;
  observacoes?: string;
  status: string;
}

export default function Movimentacoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  
  // Mock data
  const movimentacoes: Movimentacao[] = [
    {
      id: "1",
      ferramenta: "Broca HSS 10mm",
      tipo: "Saída",
      quantidade: 5,
      usuario: "João Silva",
      setor: "Usinagem",
      dataHora: "2024-01-15 10:30",
      observacoes: "Produção lote 1245",
      status: "Concluído"
    },
    {
      id: "2",
      ferramenta: "Fresa 25mm Titânio",
      tipo: "Entrada",
      quantidade: 10,
      usuario: "Maria Santos",
      setor: "Estoque",
      dataHora: "2024-01-15 09:45",
      observacoes: "Retorno de reafiamento",
      status: "Concluído" 
    },
    {
      id: "3",
      ferramenta: "Escareador 8mm HSS",
      tipo: "Reafiamento",
      quantidade: 8,
      usuario: "Pedro Costa",
      setor: "Qualidade",
      dataHora: "2024-01-15 08:15",
      observacoes: "Envio para fornecedor XYZ",
      status: "Em Andamento"
    },
    {
      id: "4", 
      ferramenta: "Pastilha Cerâmica R220",
      tipo: "Saída",
      quantidade: 20,
      usuario: "Ana Oliveira",
      setor: "Tornos CNC",
      dataHora: "2024-01-14 16:20",
      status: "Concluído"
    },
    {
      id: "5",
      ferramenta: "Broca Escalonada 3-12mm",
      tipo: "Entrada",
      quantidade: 3,
      usuario: "Carlos Mendes",
      setor: "Estoque",
      dataHora: "2024-01-14 14:10",
      observacoes: "Nova aquisição - NF 1234",
      status: "Concluído"
    }
  ];

  const stats = {
    totalMovimentacoes: 156,
    entradasMes: 45,
    saidasMes: 89,
    reafiamentoMes: 22
  };

  const filteredMovimentacoes = movimentacoes.filter(mov => {
    const matchesSearch = mov.ferramenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mov.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mov.setor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = tipoFilter === "todos" || mov.tipo === tipoFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Movimentações</h1>
          <p className="text-muted-foreground">
            Controle de entrada e saída de ferramentas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Nova Movimentação
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{stats.totalMovimentacoes}</div>
            <p className="text-xs text-muted-foreground">Total no Mês</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{stats.entradasMes}</div>
            <p className="text-xs text-muted-foreground">Entradas</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{stats.saidasMes}</div>
            <p className="text-xs text-muted-foreground">Saídas</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{stats.reafiamentoMes}</div>
            <p className="text-xs text-muted-foreground">Reafiamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por ferramenta, usuário ou setor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Saída">Saída</SelectItem>
                <SelectItem value="Reafiamento">Reafiamento</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Período
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm">Data/Hora <ArrowUpDown className="ml-1 h-3 w-3" /></Button>
                </TableHead>
                <TableHead>Ferramenta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovimentacoes.map((mov) => (
                <TableRow key={mov.id}>
                  <TableCell className="font-medium">{mov.dataHora}</TableCell>
                  <TableCell>{mov.ferramenta}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      mov.tipo === 'Entrada' ? 'bg-success/10 text-success' :
                      mov.tipo === 'Saída' ? 'bg-destructive/10 text-destructive' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {mov.tipo}
                    </span>
                  </TableCell>
                  <TableCell>{mov.quantidade}</TableCell>
                  <TableCell>{mov.usuario}</TableCell>
                  <TableCell>{mov.setor}</TableCell>
                  <TableCell>
                    <StatusBadge status={mov.status} />
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{mov.observacoes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}