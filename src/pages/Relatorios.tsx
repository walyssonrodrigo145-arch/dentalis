import React, { useState } from "react"
import {
  Download,
  Users,
  Award,
  DollarSign,
  Activity,
  ArrowUpRight,
} from "lucide-react"
import { formatCurrency } from "../utils/formatters"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export const Relatorios: React.FC = () => {
  const [periodo, setPeriodo] = useState("30d")

  // Dados Simulados para os Gráficos
  const dadosFaturamento = [
    { mes: "Jan", realizado: 28500, meta: 30000 },
    { mes: "Fev", realizado: 32000, meta: 30000 },
    { mes: "Mar", realizado: 38400, meta: 35000 },
    { mes: "Abr", realizado: 42100, meta: 35000 },
    { mes: "Mai", realizado: 39800, meta: 40000 },
    { mes: "Jun", realizado: 48500, meta: 40000 },
  ]

  const dadosProcedimentos = [
    { name: "Restauração Resina", count: 48, color: "#0284c7" },
    { name: "Clareamento Laser", count: 32, color: "#0ea5e9" },
    { name: "Tratamento de Canal", count: 18, color: "#38bdf8" },
    { name: "Implante Dentário", count: 14, color: "#7dd3fc" },
    { name: "Limpeza / Profilaxia", count: 64, color: "#bae6fd" },
  ]

  const dadosDentistas = [
    { name: "Dra. Beatriz Silva", faturamento: 24600, consultas: 38 },
    { name: "Dr. Rodrigo Martinez", faturamento: 23750, consultas: 29 },
    { name: "Dra. Camila Albuquerque", faturamento: 12400, consultas: 18 },
  ]

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Topbar de Relatórios */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Relatórios & Analytics Avançado</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Indicadores chave de desempenho (KPIs), conversão de orçamentos e produtividade clínica.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="30d">Últimos 30 Dias</option>
            <option value="90d">Trimestre</option>
            <option value="1a">Ano Atual (2026)</option>
          </select>
          <Button variant="primary" leftIcon={<Download className="h-4 w-4" />} onClick={() => alert("Simulação: Relatório analítico completo exportado em PDF!")}>
            Exportar Relatório PDF
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <DollarSign className="h-6 w-6" />
            </div>
            <Badge variant="success"><ArrowUpRight className="h-3 w-3" /> +14%</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Lucro Bruto (Período)</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(48500)}</h3>
          <p className="text-xs text-slate-400 mt-2">Margem operacional de 68%</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <Badge variant="primary">Média</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Ticket Médio por Consulta</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(680)}</h3>
          <p className="text-xs text-slate-400 mt-2">Impulsionado por implantes/estética</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <Badge variant="success">Alta</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Orçamentos Aprovados</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">78.4%</h3>
          <p className="text-xs text-slate-400 mt-2">42 aprovados de 54 apresentados</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <Badge variant="warning">Otimizado</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Procedimentos Realizados</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">176 total</h3>
          <p className="text-xs text-slate-400 mt-2">Média de 3.2 por paciente ativo</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Faturamento vs Meta */}
        <Card className="p-6 shadow-sm flex flex-col justify-between h-[420px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Faturamento Realizado vs Meta</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Comparativo mensal de desempenho de receita</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Realizado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Meta</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosFaturamento} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val / 1000}k`} />
                <RechartsTooltip // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any) => [formatCurrency(val), ""]} />
                <Bar dataKey="realizado" fill="#0284c7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="meta" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Procedimentos Mais Realizados */}
        <Card className="p-6 shadow-sm flex flex-col justify-between h-[420px]">
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">Procedimentos Mais Realizados</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Volume de tratamentos executados no período</p>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dadosProcedimentos} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="count">
                  {dadosProcedimentos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any) => [`${val} procedimentos`, "Volume"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
            {dadosProcedimentos.map((proc) => (
              <div key={proc.name} className="flex items-center gap-2 text-xs line-clamp-1">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: proc.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{proc.name} ({proc.count})</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Produtividade por Profissional */}
        <Card className="p-6 shadow-sm lg:col-span-2 flex flex-col justify-between h-[420px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-foreground">Produtividade por Dentista</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Receita gerada e volume de consultas por especialista</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosDentistas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val / 1000}k`} />
                <RechartsTooltip // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any) => [formatCurrency(val), "Faturamento"]} />
                <Bar dataKey="faturamento" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
