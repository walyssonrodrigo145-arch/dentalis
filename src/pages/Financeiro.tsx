import React, { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  Download,
  Search,
  QrCode,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { useDentalisStore } from "../store/useDentalisStore"
import type { FinanceTransaction } from "../store/useDentalisStore"
import { formatCurrency, formatDate } from "../utils/formatters"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Badge } from "../components/ui/Badge"
import { Modal } from "../components/ui/Modal"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts"

export const Financeiro: React.FC = () => {
  const { transactions, addTransaction, updateTransactionStatus } = useDentalisStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"todos" | "receita" | "despesa">("todos")
  const [statusFilter, setStatusFilter] = useState<"todos" | "pago" | "pendente" | "atrasado">("todos")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [simulacaoPix, setSimulacaoPix] = useState<FinanceTransaction | null>(null)

  // Form de Nova Transação
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0])
  const [type, setType] = useState<FinanceTransaction["type"]>("receita")
  const [category, setCategory] = useState("Procedimentos Clínicos")
  const [method, setMethod] = useState<FinanceTransaction["method"]>("pix")
  const [status, setStatus] = useState<FinanceTransaction["status"]>("pago")

  // Cálculos de Totais
  const totalReceitas = transactions
    .filter((t) => t.type === "receita" && t.status === "pago")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalDespesas = transactions
    .filter((t) => t.type === "despesa" && t.status === "pago")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const saldoAtual = totalReceitas - totalDespesas

  const inadimplencia = transactions
    .filter((t) => t.type === "receita" && t.status === "atrasado")
    .reduce((acc, curr) => acc + curr.amount, 0)

  // Filtros
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || (t.patientName && t.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === "todos" || t.type === typeFilter
    const matchesStatus = statusFilter === "todos" || t.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  // Dados para Gráfico de Categorias
  const categoriasReceita = [
    { name: "Clínico", value: 14500, color: "#0284c7" },
    { name: "Estética", value: 18200, color: "#0ea5e9" },
    { name: "Ortodontia", value: 12400, color: "#38bdf8" },
    { name: "Implantes", value: 15800, color: "#7dd3fc" },
  ]

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    addTransaction({
      description,
      amount: Number(amount),
      dueDate,
      type,
      category,
      method,
      status,
      paymentDate: status === "pago" ? new Date().toISOString().split("T")[0] : undefined,
    })

    setIsModalOpen(false)
    setDescription("")
    setAmount("")
  }

  const getStatusBadge = (status: FinanceTransaction["status"]) => {
    switch (status) {
      case "pago":
        return <Badge variant="success">PAGO</Badge>
      case "pendente":
        return <Badge variant="warning">PENDENTE</Badge>
      case "atrasado":
        return <Badge variant="destructive">ATRASADO</Badge>
    }
  }

  const getMethodIcon = (method: FinanceTransaction["method"]) => {
    switch (method) {
      case "pix":
        return <QrCode className="h-4 w-4 text-emerald-500" />
      case "cartao":
        return <CreditCard className="h-4 w-4 text-blue-500" />
      case "boleto":
        return <FileText className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Topbar do Financeiro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Gestão Financeira & Fluxo de Caixa</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Acompanhamento completo de receitas, despesas e inadimplência da clínica.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={() => alert("Simulação: Relatório financeiro exportado com sucesso em Excel/PDF!")}>
            Exportar Relatório
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsModalOpen(true)}>
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <Badge variant="success" className="flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> Receitas</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Entradas Pagas</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalReceitas)}</h3>
          <p className="text-xs text-slate-400 mt-2">Referente a procedimentos realizados</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <TrendingDown className="h-6 w-6" />
            </div>
            <Badge variant="destructive" className="flex items-center gap-1"><ArrowDownRight className="h-3 w-3" /> Despesas</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Saídas Pagas</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalDespesas)}</h3>
          <p className="text-xs text-slate-400 mt-2">Fornecedores, impostos e salários</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <DollarSign className="h-6 w-6" />
            </div>
            <Badge variant="primary" className="flex items-center gap-1">Líquido</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Saldo Atual</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(saldoAtual)}</h3>
          <p className="text-xs text-slate-400 mt-2">Disponível em contas e caixa</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <AlertCircle className="h-6 w-6" />
            </div>
            <Badge variant="warning" className="flex items-center gap-1">Atrasados</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Inadimplência</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(inadimplencia)}</h3>
          <p className="text-xs text-slate-400 mt-2">Faturas vencidas não quitadas</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>
      </div>

      {/* Main Grid: Gráficos & Listagem */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Distribuição por Categoria (1 Coluna) */}
        <Card className="p-6 shadow-sm flex flex-col justify-between h-[450px]">
          <div>
            <h3 className="text-base font-bold text-foreground mb-1">Distribuição de Receitas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Faturamento por especialidade odontológica</p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoriasReceita} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {categoriasReceita.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(val: any) => [formatCurrency(val), "Faturamento"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            {categoriasReceita.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Listagem de Transações com Filtros (2 Colunas) */}
        <Card className="p-6 lg:col-span-2 shadow-sm flex flex-col h-[450px] bg-white dark:bg-slate-900 border border-border/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <h3 className="text-base font-bold text-foreground">Movimentações Financeiras</h3>

            {/* Filtros da Tabela */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 pl-9 pr-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as "todos" | "receita" | "despesa")}
                className="h-9 px-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="todos">Todas as Tipos</option>
                <option value="receita">Receitas</option>
                <option value="despesa">Despesas</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "todos" | "pago" | "pendente" | "atrasado")}
                className="h-9 px-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="todos">Todos Status</option>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
                <option value="atrasado">Atrasado</option>
              </select>
            </div>
          </div>

          {/* Lista Virtualizada / Tabela */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
            {filteredTransactions.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">Nenhuma transação encontrada com os filtros selecionados.</div>
            ) : (
              filteredTransactions.map((tx) => (
                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-border/60 gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold shadow-sm ${tx.type === "receita" ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20" : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20"}`}>
                      {tx.type === "receita" ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-1">{tx.description}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {tx.patientName ? `${tx.patientName} • ` : ""}{tx.category}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">{getMethodIcon(tx.method)} {tx.method.toUpperCase()}</span>
                        <span>•</span>
                        <span>Venc: {formatDate(tx.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className={`text-sm font-bold block ${tx.type === "receita" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {tx.type === "receita" ? "+ " : "- "}{formatCurrency(tx.amount)}
                      </span>
                      <div className="mt-1">{getStatusBadge(tx.status)}</div>
                    </div>

                    {tx.status !== "pago" ? (
                      <div className="flex items-center gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => setSimulacaoPix(tx)}>Cobrar</Button>
                        <Button variant="primary" size="sm" onClick={() => updateTransactionStatus(tx.id, "pago")}>Quitar</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 disabled" disabled>Quitado</Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Modal de Nova Transação */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Movimentação Financeira">
        <form onSubmit={handleCreateTransaction} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select label="Tipo de Movimentação" value={type} onChange={(e) => setType(e.target.value as "receita" | "despesa")}>
              <option value="receita">Receita (Entrada)</option>
              <option value="despesa">Despesa (Saída)</option>
            </Select>

            <Input label="Valor (R$)" type="number" step="0.01" placeholder="Ex: 350.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />

            <Input label="Descrição" placeholder="Ex: Manutenção Cadeira, Clareamento..." value={description} onChange={(e) => setDescription(e.target.value)} required />

            <Input label="Data de Vencimento" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />

            <Select label="Categoria" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Procedimentos Clínicos">Procedimentos Clínicos</option>
              <option value="Estética">Estética</option>
              <option value="Exames e Diagnósticos">Exames e Diagnósticos</option>
              <option value="Fornecedores e Materiais">Fornecedores e Materiais</option>
              <option value="Manutenção e Equipamentos">Manutenção e Equipamentos</option>
              <option value="Impostos e Taxas">Impostos e Taxas</option>
            </Select>

            <Select label="Forma de Pagamento" value={method} onChange={(e) => setMethod(e.target.value as "pix" | "cartao" | "boleto")}>
              <option value="pix">Pix</option>
              <option value="cartao">Cartão de Crédito / Débito</option>
              <option value="boleto">Boleto Bancário</option>
            </Select>

            <Select label="Status Inicial" value={status} onChange={(e) => setStatus(e.target.value as "pago" | "pendente" | "atrasado")}>
              <option value="pago">Pago (Quitado)</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar Transação</Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Simulação de Cobrança Asaas (Pix / Boleto) */}
      <Modal isOpen={!!simulacaoPix} onClose={() => setSimulacaoPix(null)} title="Simulação de Cobrança Asaas">
        {simulacaoPix && (
          <div className="space-y-6 mt-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-border">
              <h4 className="text-sm font-bold text-foreground">{simulacaoPix.description}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Valor a receber: <span className="font-bold text-primary">{formatCurrency(simulacaoPix.amount)}</span></p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-2xl bg-white dark:bg-slate-900 space-y-4">
              <div className="p-4 bg-white rounded-xl shadow-md border border-slate-100">
                <QrCode className="h-40 w-40 text-slate-900" />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Escaneie o QR Code Pix para pagar</span>
              <div className="flex items-center gap-2 w-full max-w-sm">
                <input
                  type="text"
                  readOnly
                  value={`00020126580014br.gov.bcb.pix0136${simulacaoPix.id}-dentalis-asaas-simulacao5204000053039865802BR5925CLINICA DENTALIS PREMIUM6009SAO PAULO62070503***6304FE3A`}
                  className="h-9 flex-1 px-3 rounded-lg border border-border bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 font-mono focus:outline-none"
                />
                <Button variant="secondary" size="sm" onClick={() => alert("Simulação: Código Pix Copia e Cola copiado para a área de transferência!")}>
                  Copiar Pix
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <Button variant="outline" leftIcon={<FileText className="h-4 w-4" />} onClick={() => alert("Simulação: Boleto bancário gerado em PDF via Asaas!")}>
                Gerar Boleto PDF
              </Button>
              <Button variant="primary" onClick={() => {
                updateTransactionStatus(simulacaoPix.id, "pago")
                setSimulacaoPix(null)
                alert("Simulação: Pagamento via Pix confirmado instantaneamente via Webhook do Asaas!")
              }}>
                Simular Pagamento Recebido
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
