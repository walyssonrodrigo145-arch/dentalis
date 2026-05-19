import React from "react"
import {
  Users,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  ChevronRight,
  DollarSign,
  Package,
} from "lucide-react"
import { useDentalisStore } from "../store/useDentalisStore"
import { formatCurrency } from "../utils/formatters"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"
import { useNavigate } from "react-router-dom"

const chartData = [
  { month: "Jan", receita: 28500, despesa: 12000 },
  { month: "Fev", receita: 32000, despesa: 14500 },
  { month: "Mar", receita: 38400, des: 13200 },
  { month: "Abr", receita: 42100, despesa: 15800 },
  { month: "Mai", receita: 39800, despesa: 14900 },
  { month: "Jun", receita: 48500, despesa: 16200 },
]

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { patients, appointments, transactions, stockItems } = useDentalisStore()

  // Cálculos rápidos
  const totalReceitaMensal = transactions
    .filter((t) => t.type === "receita" && t.status === "pago")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const consultasHoje = appointments.filter((a) => a.date === new Date().toISOString().split("T")[0])

  const estoqueAlerta = stockItems.filter((item) => item.status !== "normal")

  const faturasPendentes = transactions.filter((t) => t.status === "pendente" || t.status === "atrasado")

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/20 dark:from-primary/20 dark:via-primary/10">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Olá, Dra. Beatriz Silva 👋</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Aqui está o resumo da sua clínica hoje. Você tem <span className="font-semibold text-primary">{consultasHoje.length} consultas</span> agendadas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/agenda")}>
            Ver Agenda Completa
          </Button>
          <Button variant="primary" onClick={() => navigate("/pacientes")}>
            Novo Atendimento
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <DollarSign className="h-6 w-6" />
            </div>
            <Badge variant="success" className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +18.2%
            </Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Faturamento Mensal</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalReceitaMensal || 48500)}</h3>
          <p className="text-xs text-slate-400 mt-2">Comparado a R$ 41.000 no mês anterior</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6" />
            </div>
            <Badge variant="primary" className="flex items-center gap-1">
              Hoje
            </Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Consultas do Dia</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{consultasHoje.length} atendimentos</h3>
          <p className="text-xs text-slate-400 mt-2">2 confirmados • 1 em atendimento</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <Badge variant="success" className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +4 novos
            </Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Pacientes Ativos</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{patients.length} cadastrados</h3>
          <p className="text-xs text-slate-400 mt-2">Taxa de retenção em 94%</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <Badge variant="warning" className="flex items-center gap-1">
              Atenção
            </Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Alertas de Estoque</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{estoqueAlerta.length} itens</h3>
          <p className="text-xs text-slate-400 mt-2">1 crítico • 1 em estoque mínimo</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>
      </div>

      {/* Main Charts & Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Faturamento Chart (Span 2) */}
        <Card className="p-6 lg:col-span-2 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Faturamento Anual</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Acompanhamento de Receitas vs Despesas em 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Receitas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Despesas</span>
              </div>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val / 1000}k`} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "1rem",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatCurrency(value), ""]}
                />
                <Area type="monotone" dataKey="receita" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorReceita)" />
                <Area type="monotone" dataKey="despesa" stroke="#fb7185" strokeWidth={2} fillOpacity={1} fill="url(#colorDespesa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Próximos Atendimentos (Span 1) */}
        <Card className="p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Consultas de Hoje</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{consultasHoje.length} pacientes agendados</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/agenda")} className="text-primary hover:text-primary/80">
                Ver tudo <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
              {consultasHoje.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">Nenhuma consulta agendada para hoje.</div>
              ) : (
                consultasHoje.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center font-bold text-primary text-sm shadow-sm">
                        {apt.patientName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{apt.patientName}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <Clock className="h-3 w-3 text-primary" /> {apt.time} ({apt.duration} min)
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        apt.status === "em_atendimento"
                          ? "warning"
                          : apt.status === "confirmado"
                          ? "primary"
                          : apt.status === "finalizado"
                          ? "success"
                          : "default"
                      }
                    >
                      {apt.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <Button variant="primary" className="w-full mt-6" onClick={() => navigate("/agenda")}>
            Agendar Novo Paciente
          </Button>
        </Card>
      </div>

      {/* Bottom Section: Alertas de Estoque & Faturas Pendentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Estoque em Alerta */}
        <Card className="p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-rose-500" />
              <h3 className="text-lg font-bold text-foreground">Estoque com Estoque Baixo</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/estoque")} className="text-primary hover:text-primary/80">
              Gerenciar Estoque <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {estoqueAlerta.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">Todos os materiais estão com estoque normal.</div>
            ) : (
              estoqueAlerta.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                  <div>
                    <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">{item.name}</h4>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                      Estoque atual: <span className="font-bold">{item.currentStock}</span> (Mínimo: {item.minStock})
                    </p>
                  </div>
                  <Badge variant="destructive">{item.status.toUpperCase()}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Faturas Pendentes / Atrasadas */}
        <Card className="p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-bold text-foreground">Movimentações Pendentes</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/financeiro")} className="text-primary hover:text-primary/80">
              Acessar Financeiro <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {faturasPendentes.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">Nenhuma fatura pendente ou em atraso.</div>
            ) : (
              faturasPendentes.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">{tx.description}</h4>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                      Vencimento: {tx.dueDate.split("-").reverse().join("/")} • {tx.patientName || "Fornecedor"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground block">{formatCurrency(tx.amount)}</span>
                    <Badge variant={tx.status === "atrasado" ? "destructive" : "warning"} className="mt-1">
                      {tx.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
