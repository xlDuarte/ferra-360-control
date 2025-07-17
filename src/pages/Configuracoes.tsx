import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, Bell, Shield, Database, Mail, Server, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Configuracoes = () => {
  const [notificacaoEmail, setNotificacaoEmail] = useState(true);
  const [notificacaoSistema, setNotificacaoSistema] = useState(true);
  const [backupAutomatico, setBackupAutomatico] = useState(true);
  const [auditoria, setAuditoria] = useState(true);

  const handleSave = (section: string) => {
    toast({
      title: "Configurações salvas",
      description: `As configurações de ${section} foram atualizadas com sucesso.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações do Sistema</h1>
          <p className="text-muted-foreground">Gerencie as configurações gerais do Estoque360</p>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="integracao">Integração</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="empresa">Nome da Empresa</Label>
                  <Input 
                    id="empresa" 
                    defaultValue="Indústria Metalúrgica ABC" 
                    placeholder="Digite o nome da empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input 
                    id="cnpj" 
                    defaultValue="12.345.678/0001-90" 
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input 
                    id="endereco" 
                    defaultValue="Rua Industrial, 1000" 
                    placeholder="Digite o endereço"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    defaultValue="(11) 3456-7890" 
                    placeholder="(00) 0000-0000"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configurações de Estoque</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="diasAlerta">Dias para Alerta de Vencimento</Label>
                    <Input 
                      id="diasAlerta" 
                      type="number" 
                      defaultValue="30" 
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formatoCodigo">Formato de Código Padrão</Label>
                    <Select defaultValue="abc-000">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="abc-000">ABC-000</SelectItem>
                        <SelectItem value="000-abc">000-ABC</SelectItem>
                        <SelectItem value="abc000">ABC000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("gerais")}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber alertas importantes por email
                    </p>
                  </div>
                  <Switch 
                    checked={notificacaoEmail} 
                    onCheckedChange={setNotificacaoEmail} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações do Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar notificações na interface do sistema
                    </p>
                  </div>
                  <Switch 
                    checked={notificacaoSistema} 
                    onCheckedChange={setNotificacaoSistema} 
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configurações de Email</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">Servidor SMTP</Label>
                    <Input 
                      id="smtpHost" 
                      defaultValue="smtp.empresa.com" 
                      placeholder="smtp.exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Porta SMTP</Label>
                    <Input 
                      id="smtpPort" 
                      type="number" 
                      defaultValue="587" 
                      placeholder="587"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailRemetente">Email Remetente</Label>
                    <Input 
                      id="emailRemetente" 
                      type="email" 
                      defaultValue="estoque@empresa.com" 
                      placeholder="sistema@empresa.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senhaEmail">Senha do Email</Label>
                    <Input 
                      id="senhaEmail" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("notificações")}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Notificações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log de Auditoria</Label>
                    <p className="text-sm text-muted-foreground">
                      Registrar todas as ações dos usuários no sistema
                    </p>
                  </div>
                  <Switch 
                    checked={auditoria} 
                    onCheckedChange={setAuditoria} 
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Políticas de Senha</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minCaracteres">Mínimo de Caracteres</Label>
                    <Input 
                      id="minCaracteres" 
                      type="number" 
                      defaultValue="8" 
                      placeholder="8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validadeSenha">Validade da Senha (dias)</Label>
                    <Input 
                      id="validadeSenha" 
                      type="number" 
                      defaultValue="90" 
                      placeholder="90"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tentativasLogin">Máximo de Tentativas de Login</Label>
                    <Input 
                      id="tentativasLogin" 
                      type="number" 
                      defaultValue="5" 
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempoSessao">Tempo de Sessão (minutos)</Label>
                    <Input 
                      id="tempoSessao" 
                      type="number" 
                      defaultValue="240" 
                      placeholder="240"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("segurança")}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Segurança
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configurações de Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Executar backup automático do banco de dados
                    </p>
                  </div>
                  <Switch 
                    checked={backupAutomatico} 
                    onCheckedChange={setBackupAutomatico} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configurações de Backup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="frequenciaBackup">Frequência</Label>
                    <Select defaultValue="diario">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diário</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retencaoBackup">Retenção (dias)</Label>
                    <Input 
                      id="retencaoBackup" 
                      type="number" 
                      defaultValue="30" 
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localBackup">Local do Backup</Label>
                    <Input 
                      id="localBackup" 
                      defaultValue="/backup/estoque360" 
                      placeholder="/caminho/para/backup"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horarioBackup">Horário</Label>
                    <Input 
                      id="horarioBackup" 
                      type="time" 
                      defaultValue="02:00"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={() => toast({
                    title: "Backup Iniciado",
                    description: "Backup manual do sistema iniciado com sucesso."
                  })}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Executar Backup Agora
                </Button>
                <Button onClick={() => handleSave("backup")}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integracao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Integrações Externas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API do Sistema ERP</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="urlApi">URL da API</Label>
                    <Input 
                      id="urlApi" 
                      placeholder="https://api.erp.empresa.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chaveApi">Chave da API</Label>
                    <Input 
                      id="chaveApi" 
                      type="password" 
                      placeholder="••••••••••••••••"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Códigos QR / RFID</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="prefixoQr">Prefixo QR Code</Label>
                    <Input 
                      id="prefixoQr" 
                      defaultValue="EST360-" 
                      placeholder="EST360-"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tamanhoQr">Tamanho QR Code (px)</Label>
                    <Input 
                      id="tamanhoQr" 
                      type="number" 
                      defaultValue="150" 
                      placeholder="150"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Aviso Importante</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      As integrações externas requerem configuração técnica específica. 
                      Consulte a documentação ou entre em contato com o suporte.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave("integração")}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Integrações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;