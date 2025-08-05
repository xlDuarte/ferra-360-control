import { useState } from "react";
import { Calendar, DollarSign, TrendingUp, TrendingDown, Package, Clock, Wrench, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { DashboardCard } from "@/components/DashboardCard";

const monthlyData = [
  { month: "Jan", custoEstoque: 45000, custoReafiacaoExterna: 7000, economiaReafiacaoInterna: 5000, custoHoraMaquina: 8000, custoTotal: 65000 },
  { month: "Fev", custoEstoque: 48000, custoReafiacaoExterna: 8000, economiaReafiacaoInterna: 6000, custoHoraMaquina: 8500, custoTotal: 70500 },
  { month: "Mar", custoEstoque: 52000, custoReafiacaoExterna: 6000, economiaReafiacaoInterna: 5000, custoHoraMaquina: 9200, custoTotal: 72200 },
  { month: "Abr", custoEstoque: 49000, custoReafiacaoExterna: 9000, economiaReafiacaoInterna: 6000, custoHoraMaquina: 8800, custoTotal: 72800 },
  { month: "Mai", custoEstoque: 55000, custoReafiacaoExterna: 7500, economiaReafiacaoInterna: 5500, custoHoraMaquina: 9500, custoTotal: 77500 },
  { month: "Jun", custoEstoque: 58000, custoReafiacaoExterna: 9000, economiaReafiacaoInterna: 7000, custoHoraMaquina: 10000, custoTotal: 84000 },
];

const costByCategory = [
  { name: "Estoque Total", value: 320000, color: "#3b82f6" },
  { name: "Reafiação Externa", value: 46500, color: "#ef4444" },
  { name: "Economia Reafiação Interna", value: 34500, color: "#10b981" },
  { name: "Hora/Máquina", value: 54000, color: "#f59e0b" },
  { name: "Manutenção", value: 25000, color: "#8b5cf6" },
];

const chartConfig = {
  custoEstoque: { label: "Custo Estoque", color: "#3b82f6" },
  custoReafiacaoExterna: { label: "Reafiação Externa", color: "#ef4444" },
  economiaReafiacaoInterna: { label: "Economia Reafiação Interna", color: "#10b981" },
  custoHoraMaquina: { label: "Custo H/Máquina", color: "#f59e0b" },
  custoTotal: { label: "Custo Total", color: "#8b5cf6" },
};

export default function Custos() {
  const [filtroMes, setFiltroMes] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const totalCustoEstoque = 320000;
  const custoEstoqueDisponivel = 195000;
  const custoReafiacaoExternaMensal = 9000;
  const economiaReafiacaoInternaMensal = 7000;
  const custoHoraMaquinaMensal = 10000;

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard de Custos
          </h1>
          <p className="text-muted-foreground">
            Monitore e analise todos os custos operacionais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border shadow-card">
        <div className="flex-1">
          <Input
            placeholder="Buscar por período, categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filtroMes} onValueChange={setFiltroMes}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os meses</SelectItem>
            <SelectItem value="janeiro">Janeiro</SelectItem>
            <SelectItem value="fevereiro">Fevereiro</SelectItem>
            <SelectItem value="marco">Março</SelectItem>
            <SelectItem value="abril">Abril</SelectItem>
            <SelectItem value="maio">Maio</SelectItem>
            <SelectItem value="junho">Junho</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tipo de custo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="estoque">Estoque</SelectItem>
            <SelectItem value="reafiacao-externa">Reafiação Externa</SelectItem>
            <SelectItem value="reafiacao-interna">Economia Reafiação Interna</SelectItem>
            <SelectItem value="maquina">Hora/Máquina</SelectItem>
            <SelectItem value="manutencao">Manutenção</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 md:gap-6">
        <DashboardCard
          title="Custo Total Estoque"
          value={`R$ ${totalCustoEstoque.toLocaleString('pt-BR')}`}
          description="Valor total investido"
          icon={Package}
          trend={{ value: 8.2, isPositive: false }}
        />
        <DashboardCard
          title="Estoque Disponível"
          value={`R$ ${custoEstoqueDisponivel.toLocaleString('pt-BR')}`}
          description="Valor disponível para uso"
          icon={DollarSign}
          trend={{ value: 3.1, isPositive: true }}
        />
        <DashboardCard
          title="Reafiação Externa"
          value={`R$ ${custoReafiacaoExternaMensal.toLocaleString('pt-BR')}`}
          description="Custo reafiação externa"
          icon={Wrench}
          trend={{ value: 15.2, isPositive: false }}
        />
        <DashboardCard
          title="Economia Reafiação Interna"
          value={`R$ ${economiaReafiacaoInternaMensal.toLocaleString('pt-BR')}`}
          description="Economia com reafiação interna"
          icon={TrendingUp}
          trend={{ value: 2.8, isPositive: true }}
        />
        <DashboardCard
          title="Hora/Máquina Mensal"
          value={`R$ ${custoHoraMaquinaMensal.toLocaleString('pt-BR')}`}
          description="Custo operacional"
          icon={Clock}
          trend={{ value: 5.4, isPositive: true }}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-2">
        {/* Gráfico de Barras - Evolução Mensal */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Evolução de Custos Mensais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={monthlyData} 
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-muted-foreground" 
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    className="text-muted-foreground" 
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    width={40}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="custoEstoque" fill="var(--color-custoEstoque)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="custoReafiacaoExterna" fill="var(--color-custoReafiacaoExterna)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="economiaReafiacaoInterna" fill="var(--color-economiaReafiacaoInterna)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="custoHoraMaquina" fill="var(--color-custoHoraMaquina)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-2 flex flex-wrap gap-2 justify-center text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#3b82f6" }}></div>
                <span>Estoque</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#ef4444" }}></div>
                <span>Reafiação Externa</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#10b981" }}></div>
                <span>Economia Interna</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: "#f59e0b" }}></div>
                <span>H/Máquina</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Distribuição de Custos */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-primary" />
              Distribuição de Custos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Pie
                    data={costByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={false}
                  >
                    {costByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {costByCategory.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                  <span className="truncate">{entry.name}</span>
                  <span className="ml-auto font-medium">
                    {((entry.value / costByCategory.reduce((acc, item) => acc + item.value, 0)) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Linha - Tendência de Custo Total */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            Tendência de Custo Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line 
                  type="monotone" 
                  dataKey="custoTotal" 
                  stroke="var(--color-custoTotal)" 
                  strokeWidth={3}
                  dot={{ fill: "var(--color-custoTotal)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tabela de Detalhes */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Detalhamento de Custos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Valor Atual</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Variação</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-foreground">Custo Total do Estoque</td>
                  <td className="py-3 px-4 text-foreground">R$ 320.000,00</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center text-destructive">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      -8.2%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="destructive">Alto</Badge>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-foreground">Custo Estoque Disponível</td>
                  <td className="py-3 px-4 text-foreground">R$ 195.000,00</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center text-success">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +3.1%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary">Normal</Badge>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-foreground">Reafiação Interna</td>
                  <td className="py-3 px-4 text-foreground">R$ 9.000,00</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center text-success">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +2.8%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary">Normal</Badge>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-foreground">Reafiação Externa</td>
                  <td className="py-3 px-4 text-foreground">R$ 7.000,00</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center text-destructive">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      -15.2%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="destructive">Alto</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-foreground">Hora/Máquina</td>
                  <td className="py-3 px-4 text-foreground">R$ 10.000,00</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center text-success">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +5.4%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary">Normal</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}