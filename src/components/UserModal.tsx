import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Edit } from "lucide-react";

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

interface UserModalProps {
  user?: User;
  onSave: (user: User) => void;
  trigger?: React.ReactNode;
}

export const UserModal = ({ user, onSave, trigger }: UserModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    perfil: "Requisitante" as User["perfil"],
    setor: "",
    status: "Ativo" as User["status"],
    senha: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        setor: user.setor,
        status: user.status,
        senha: ""
      });
    } else {
      setFormData({
        nome: "",
        email: "",
        perfil: "Requisitante",
        setor: "",
        status: "Ativo",
        senha: ""
      });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.setor) {
      toast({
        title: "Erro de Validação",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (!user && !formData.senha) {
      toast({
        title: "Erro de Validação",
        description: "Senha é obrigatória para novos usuários",
        variant: "destructive"
      });
      return;
    }

    const newUser: User = {
      id: user ? user.id : Math.random().toString(36).substr(2, 9),
      nome: formData.nome,
      email: formData.email,
      perfil: formData.perfil,
      setor: formData.setor,
      status: formData.status,
      ultimoAcesso: user ? user.ultimoAcesso : "Nunca",
      dataRegistro: user ? user.dataRegistro : new Date().toLocaleDateString('pt-BR')
    };

    onSave(newUser);
    setOpen(false);
    
    toast({
      title: user ? "Usuário Atualizado" : "Usuário Criado",
      description: `${formData.nome} foi ${user ? "atualizado" : "criado"} com sucesso`
    });
  };

  const defaultTrigger = user ? (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button className="bg-primary hover:bg-primary/90">
      <UserPlus className="mr-2 h-4 w-4" />
      Novo Usuário
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {user ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Digite o nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="usuario@empresa.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="perfil">Perfil de Acesso *</Label>
              <Select value={formData.perfil} onValueChange={(value: User["perfil"]) => setFormData({ ...formData, perfil: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Estoquista">Estoquista</SelectItem>
                  <SelectItem value="Aprovador">Aprovador</SelectItem>
                  <SelectItem value="Requisitante">Requisitante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="setor">Setor *</Label>
              <Input
                id="setor"
                value={formData.setor}
                onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                placeholder="Ex: TI, Produção, Compras"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: User["status"]) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">{user ? "Nova Senha (opcional)" : "Senha *"}</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                placeholder={user ? "Deixe vazio para manter atual" : "Digite uma senha"}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {user ? "Atualizar" : "Criar"} Usuário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};