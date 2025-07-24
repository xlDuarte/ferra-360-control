import { useState } from "react";
import { Plus, Search, Filter, Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { ToolModal } from "@/components/ToolModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Ferramenta | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  
  // Mock data
  const ferramentas: Ferramenta[] = [
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
  ];

  const filteredFerramentas = ferramentas.filter(ferramenta =>
    ferramenta.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ferramenta.fabricante.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Button
          className="bg-gradient-primary"
          onClick={() => {
            setSelected(null);
            setReadOnly(false);
            setIsModalOpen(true);
          }}
        >
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
            <Button 
              variant="outline"
              onClick={() => toast({
                title: "Filtros Avançados",
                description: "Funcionalidade de filtros avançados em desenvolvimento."
              })}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
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
                        onClick={() => {
                          setSelected(ferramenta);
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
                          setSelected(ferramenta);
                          setReadOnly(false);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (window.confirm(`Remover ${ferramenta.codigo}?`)) {
                            toast({
                              title: 'Ferramenta removida',
                              description: `${ferramenta.codigo} excluída`,
                              variant: 'destructive'
                            });
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
      
      <ToolModal
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