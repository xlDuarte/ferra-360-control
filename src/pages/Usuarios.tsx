import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, UserPlus, Edit, Trash2, Shield, Clock } from "lucide-react";

interface User {
  id: string;
  nome: string;
  email: string;
  perfil: "Administrador" | "Estoquista" | "Requisitante" | "Aprovador";
  setor: string;
  status: "Ativo" | "Inativo" | "Bloqueado";
  ultimoAcesso: string;
  dataRegistro: string;
}

const mockUsuarios: User[] = [
  { id: "1", nome: "João Silva", email: "joao.silva@empresa.com", perfil: "Administrador", setor: "TI", status: "Ativo", ultimoAcesso: "2024-01-15 14:30", dataRegistro: "2023-06-15" },
  { id: "2", nome: "Maria Santos", email: "maria.santos@empresa.com", perfil: "Estoquista", setor: "Almoxarifado", status: "Ativo", ultimoAcesso: "2024-01-15 16:45", dataRegistro: "2023-08-22" },
  { id: "3", nome: "Carlos Pereira", email: "carlos.pereira@empresa.com", perfil: "Aprovador", setor: "Compras", status: "Ativo", ultimoAcesso: "2024-01-15 09:15", dataRegistro: "2023-05-10" },
  { id: "4", nome: "Ana Costa", email: "ana.costa@empresa.com", perfil: "Requisitante", setor: "Produção", status: "Ativo", ultimoAcesso: "2024-01-14 17:20", dataRegistro: "2023-11-03" },
  { id: "5", nome: "Pedro Oliveira", email: "pedro.oliveira@empresa.com", perfil: "Requisitante", setor: "Manutenção", status: "Inativo", ultimoAcesso: "2024-01-10 11:30", dataRegistro: "2023-07-18" },
];

const Usuarios = () => {
  const [search, setSearch] = useState("");
  const [perfilFilter, setPerfilFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredUsuarios = mockUsuarios.filter(user => {
    const matchesSearch = user.nome.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase()) ||
                         user.setor.toLowerCase().includes(search.toLowerCase());
    
    const matchesPerfil = perfilFilter === "all" || user.perfil === perfilFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesPerfil && matchesStatus;
  });

  const totalUsuarios = mockUsuarios.length;
  const usuariosAtivos = mockUsuarios.filter(u => u.status === "Ativo").length;
  const usuariosBloqueados = mockUsuarios.filter(u => u.status === "Bloqueado").length;

  const getPerfilBadgeVariant = (perfil: string) => {
    switch (perfil) {
      case "Administrador": return "default";
      case "Estoquista": return "secondary";
      case "Aprovador": return "outline";
      case "Requisitante": return "secondary";
      default: return "secondary";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Ativo": return "default";
      case "Inativo": return "secondary";
      case "Bloqueado": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Usuários</h1>
          <p className="text-muted-foreground">Controle de acesso e permissões do sistema</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsuarios}</div>
            <p className="text-xs text-muted-foreground">usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{usuariosAtivos}</div>
            <p className="text-xs text-muted-foreground">com acesso ativo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{usuariosBloqueados}</div>
            <p className="text-xs text-muted-foreground">usuários bloqueados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Agora</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <p className="text-xs text-muted-foreground">usuários conectados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou setor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={perfilFilter} onValueChange={setPerfilFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Perfis</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Estoquista">Estoquista</SelectItem>
                <SelectItem value="Aprovador">Aprovador</SelectItem>
                <SelectItem value="Requisitante">Requisitante</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Bloqueado">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Data Registro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsuarios.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${user.email}`} />
                        <AvatarFallback>{user.nome.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.nome}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getPerfilBadgeVariant(user.perfil)}>
                      {user.perfil}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.setor}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.ultimoAcesso}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.dataRegistro}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
    </div>
  );
};

export default Usuarios;