import { 
  Package, Wrench, ArrowRightLeft, FileText, 
  AlertTriangle, Clock, TrendingUp, Users 
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Mock data - em produção viriam de uma API
  const stats = {
    totalFerramentas: 1247,
    ferramentasAtivas: 982,
    emReafiamento: 45,
    descartadas: 220,
    requisicoesPendentes: 12,
    ordenesAbertas: 8,
    alertasEstoque: 5
  };

  const recentMovements = [
    { id: 1, tool: "Broca HSS 10mm", action: "Saída", user: "João Silva", time: "10:30" },
    { id: 2, tool: "Fresa 25mm", action: "Retorno", user: "Maria Santos", time: "09:45" },
    { id: 3, tool: "Escareador 8mm", action: "Reafiamento", user: "Pedro Costa", time: "09:15" },
  ];

  const pendingApprovals = [
    { id: 1, type: "Requisição", description: "Compra de brocas HSS", value: "R$ 2.350,00", urgent: true },
    { id: 2, type: "Reafiamento", description: "Lote 15 fresas", value: "R$ 890,00", urgent: false },
    { id: 3, type: "Requisição", description: "Pastilhas de corte", value: "R$ 1.200,00", urgent: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de gestão de estoque
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <TrendingUp className="mr-2 h-4 w-4" />
          Relatório Completo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total de Ferramentas"
          value={stats.totalFerramentas}
          description="Itens cadastrados no sistema"
          icon={Package}
          trend={{ value: 5.2, isPositive: true }}
        />
        
        <DashboardCard
          title="Ferramentas Ativas"
          value={stats.ferramentasAtivas}
          description="Disponíveis para uso"
          icon={Wrench}
          trend={{ value: 2.1, isPositive: true }}
        />
        
        <DashboardCard
          title="Em Reafiamento"
          value={stats.emReafiamento}
          description="Aguardando retorno"
          icon={Clock}
          trend={{ value: -12.5, isPositive: false }}
        />
        
        <DashboardCard
          title="Requisições Pendentes"
          value={stats.requisicoesPendentes}
          description="Aguardando aprovação"
          icon={FileText}
          trend={{ value: 8.3, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Movimentações Recentes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowRightLeft className="mr-2 h-5 w-5 text-primary" />
              Movimentações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{movement.tool}</p>
                    <p className="text-sm text-muted-foreground">
                      {movement.user} • {movement.time}
                    </p>
                  </div>
                  <StatusBadge 
                    status={movement.action === "Saída" ? "Em Uso" : movement.action === "Retorno" ? "Disponível" : "Em Reafiamento"} 
                  />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todas as Movimentações
            </Button>
          </CardContent>
        </Card>

        {/* Aprovações Pendentes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Aprovações Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{approval.description}</p>
                      {approval.urgent && (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {approval.type} • {approval.value}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Ver Todas as Aprovações
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Estoque */}
      {stats.alertasEstoque > 0 && (
        <Card className="shadow-card border-warning">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Alertas de Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {stats.alertasEstoque} ferramentas estão com estoque abaixo do mínimo recomendado.
            </p>
            <Button variant="outline" className="border-warning text-warning hover:bg-warning hover:text-warning-foreground">
              Ver Alertas
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}