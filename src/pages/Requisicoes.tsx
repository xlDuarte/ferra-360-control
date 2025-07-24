import { useState } from "react";
import { Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertTriangle, Eye, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { RequestModal } from "@/components/RequestModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Requisicao {
  id: string;
  numero: string;
  tipo: string;
  descricao: string;
  solicitante: string;
  setor: string;
  prioridade: string;
  valor: string;
  dataAbertura: string;
  prazo: string;
  status: string;
  aprovador?: string;
}

export default function Requisicoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Requisicao | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  
  // Mock data
  const requisicoes: Requisicao[] = [
    {
      id: "1",
      numero: "PR-2024-001",
      tipo: "Compra",
      descricao: "Brocas HSS variadas - lote emergencial",
      solicitante: "João Silva",
      setor: "Usinagem",
      prioridade: "Alta",
      valor: "R$ 2.350,00",
      dataAbertura: "2024-01-15",
      prazo: "2024-01-20",
      status: "Pendente",
      aprovador: "Maria Santos"
    },
    {
      id: "2",
      numero: "PR-2024-002", 
      tipo: "Reafiamento",
      descricao: "Reafiamento lote 15 fresas de topo",
      solicitante: "Pedro Costa",
      setor: "Qualidade",
      prioridade: "Média",
      valor: "R$ 890,00",
      dataAbertura: "2024-01-14",
      prazo: "2024-01-25",
      status: "Aprovado",
      aprovador: "Carlos Mendes"
    },
    {
      id: "3",
      numero: "PR-2024-003",
      tipo: "Compra",
      descricao: "Pastilhas de corte cerâmicas R220",
      solicitante: "Ana Oliveira",
      setor: "Tornos CNC", 
      prioridade: "Alta",
      valor: "R$ 1.200,00",
      dataAbertura: "2024-01-13",
      prazo: "2024-01-18",
      status: "Em Andamento"
    },
    {
      id: "4",
      numero: "PR-2024-004",
      tipo: "Compra",
      descricao: "Kit escareadores HSS 6-20mm",
      solicitante: "Roberto Lima",
      setor: "Montagem",
      prioridade: "Baixa",
      valor: "R$ 485,00", 
      dataAbertura: "2024-01-12",
      prazo: "2024-01-30",
      status: "Rejeitado",
      aprovador: "Maria Santos"
    },
    {
      id: "5",
      numero: "PR-2024-005",
      tipo: "Reafiamento",
      descricao: "Manutenção preventiva ferramentas setor A",
      solicitante: "Julia Ferreira",
      setor: "Manutenção",
      prioridade: "Média",
      valor: "R$ 1.850,00",
      dataAbertura: "2024-01-11",
      prazo: "2024-02-01",
      status: "Concluído"
    }
  ];

  const stats = {
    totalRequisicoes: 48,
    pendentes: 12,
    aprovadas: 28,
    rejeitadas: 8
  };

  const filteredRequisicoes = requisicoes.filter(req => {
    const matchesSearch = req.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.solicitante.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || req.status === statusFilter;
    const matchesType = tipoFilter === "todos" || req.tipo === tipoFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-destructive/10 text-destructive';
      case 'Média': return 'bg-warning/10 text-warning';
      case 'Baixa': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pendente': return <Clock className="h-4 w-4 text-warning" />;
      case 'Aprovado': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Rejeitado': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'Em Andamento': return <AlertTriangle className="h-4 w-4 text-primary" />;
      case 'Concluído': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Requisições</h1>
          <p className="text-muted-foreground">
            Gerencie requisições de compra e reafiamento
          </p>
        </div>
        <Button
          className="bg-gradient-primary"
          onClick={() => {
            setSelected(null);
            setReadOnly(false);
            setIsModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Requisição
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">{stats.totalRequisicoes}</div>
            <p className="text-xs text-muted-foreground">Total no Mês</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">{stats.pendentes}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">{stats.aprovadas}</div>
            <p className="text-xs text-muted-foreground">Aprovadas</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{stats.rejeitadas}</div>
            <p className="text-xs text-muted-foreground">Rejeitadas</p>
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
                placeholder="Buscar por número, descrição ou solicitante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
                <SelectItem value="Rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Compra">Compra</SelectItem>
                <SelectItem value="Reafiamento">Reafiamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Lista de Requisições</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequisicoes.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.numero}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{req.tipo}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{req.descricao}</TableCell>
                  <TableCell>{req.solicitante}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(req.prioridade)}`}>
                      {req.prioridade}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{req.valor}</TableCell>
                  <TableCell>{req.prazo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(req.status)}
                      <StatusBadge status={req.status} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelected(req);
                          setReadOnly(true);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelected(req);
                          setReadOnly(false);
                          setIsModalOpen(true);
                        }}
                      >
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
      
      <RequestModal
        open={isModalOpen}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
          setIsModalOpen(o);
        }}
        initialData={selected || undefined}
        readOnly={readOnly}
      />
    </div>
  );
}