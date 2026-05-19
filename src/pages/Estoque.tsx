import React, { useState } from "react"
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Trash2,
} from "lucide-react"
import { useDentalisStore } from "../store/useDentalisStore"
import type { StockItem } from "../store/useDentalisStore"
import { formatDate } from "../utils/formatters"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Badge } from "../components/ui/Badge"
import { Modal } from "../components/ui/Modal"

export const Estoque: React.FC = () => {
  const { stockItems, addStockItem, updateStockItem, deleteStockItem } = useDentalisStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("todos")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string>("")

  // Form Novo Item
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Restauradores")
  const [currentStock, setCurrentStock] = useState("")
  const [minStock, setMinStock] = useState("")
  const [unit, setUnit] = useState("Unidade")
  const [expiryDate, setExpiryDate] = useState(() => new Date(Date.now() + 86400000 * 365).toISOString().split("T")[0])
  const [supplier, setSupplier] = useState("Dental Cremer")

  // Form Movimentação Rápida
  const [moveType, setMoveType] = useState<"entrada" | "saida">("entrada")
  const [moveQuantity, setMoveQuantity] = useState("")

  // Cálculos
  const itensCriticos = stockItems.filter((i) => i.status === "critico")
  const itensAlerta = stockItems.filter((i) => i.status === "alerta")
  const itensNormal = stockItems.filter((i) => i.status === "normal")

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "todos" || item.category === categoryFilter
    const matchesStatus = statusFilter === "todos" || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !currentStock || !minStock) return

    addStockItem({
      name,
      category,
      currentStock: Number(currentStock),
      minStock: Number(minStock),
      unit,
      expiryDate,
      supplier,
      status: Number(currentStock) <= Number(minStock) ? (Number(currentStock) <= Number(minStock) / 2 ? "critico" : "alerta") : "normal",
    })

    setIsAddModalOpen(false)
    setName("")
    setCurrentStock("")
    setMinStock("")
  }

  const handleMoveStock = (e: React.FormEvent) => {
    e.preventDefault()
    const item = stockItems.find((i) => i.id === selectedItemId)
    if (!item || !moveQuantity) return

    const qty = Number(moveQuantity)
    const newStock = moveType === "entrada" ? item.currentStock + qty : Math.max(0, item.currentStock - qty)

    updateStockItem(item.id, { currentStock: newStock })
    setIsMoveModalOpen(false)
    setMoveQuantity("")
  }

  const getStatusBadge = (status: StockItem["status"]) => {
    switch (status) {
      case "normal":
        return <Badge variant="success">NORMAL</Badge>
      case "alerta":
        return <Badge variant="warning">ALERTA (MÍNIMO)</Badge>
      case "critico":
        return <Badge variant="destructive">CRÍTICO / FALTANDO</Badge>
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Topbar do Estoque */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Controle de Estoque e Materiais</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Gestão de inventário, controle de validade e alertas automáticos de resuprimento.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" leftIcon={<Layers className="h-4 w-4" />} onClick={() => {
            if (stockItems.length > 0) { setSelectedItemId(stockItems[0].id); setIsMoveModalOpen(true) }
          }}>
            Movimentar Estoque
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsAddModalOpen(true)}>
            Novo Material
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Package className="h-6 w-6" />
            </div>
            <Badge variant="primary">Total</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total de Materiais</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{stockItems.length} itens</h3>
          <p className="text-xs text-slate-400 mt-2">Cadastrados no inventário</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <Badge variant="success">Adequado</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Estoque Normal</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{itensNormal.length} itens</h3>
          <p className="text-xs text-slate-400 mt-2">Acima do estoque mínimo</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <Badge variant="warning">Atenção</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Estoque em Alerta</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{itensAlerta.length} itens</h3>
          <p className="text-xs text-slate-400 mt-2">Atingiram o estoque mínimo</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <Badge variant="destructive">Urgente</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Estoque Crítico</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{itensCriticos.length} itens</h3>
          <p className="text-xs text-slate-400 mt-2">Abaixo da metade do mínimo ou zerados</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>
      </div>

      {/* Tabela / Lista de Materiais */}
      <Card className="p-6 shadow-sm bg-white dark:bg-slate-900 border border-border/80 min-h-[500px] flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <h3 className="text-base font-bold text-foreground">Inventário de Materiais</h3>

          {/* Filtros da Tabela */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar material ou fornecedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-9 pr-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 px-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="todos">Todas Categorias</option>
              <option value="Restauradores">Restauradores</option>
              <option value="Anestésicos">Anestésicos</option>
              <option value="Descartáveis">Descartáveis</option>
              <option value="Cimentos">Cimentos</option>
              <option value="Instrumentais">Instrumentais</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="todos">Todos Status</option>
              <option value="normal">Normal</option>
              <option value="alerta">Alerta</option>
              <option value="critico">Crítico</option>
            </select>
          </div>
        </div>

        {/* Lista Virtualizada / Tabela */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1">
          {filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Nenhum material encontrado no estoque.</div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-border/60 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold shadow-sm ${
                    item.status === "normal" ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20" : item.status === "alerta" ? "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20" : "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20"
                  }`}>
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Categoria: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.category}</span> • Fornecedor: {item.supplier}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Validade: {formatDate(item.expiryDate)}</span>
                      <span>•</span>
                      <span>Unidade: {item.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Qtd Atual / Mín</span>
                    <div className="flex items-center justify-end gap-2 font-bold text-sm text-foreground">
                      <span className={item.currentStock <= item.minStock ? "text-rose-500" : ""}>{item.currentStock}</span>
                      <span className="text-slate-300 dark:text-slate-600">/</span>
                      <span className="text-slate-400">{item.minStock}</span>
                    </div>
                  </div>

                  <div>{getStatusBadge(item.status)}</div>

                  <div className="flex items-center gap-1.5 border-l border-border pl-4">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedItemId(item.id); setMoveType("entrada"); setIsMoveModalOpen(true) }}>
                      +
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedItemId(item.id); setMoveType("saida"); setIsMoveModalOpen(true) }}>
                      -
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteStockItem(item.id)} className="text-rose-500 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Modal de Novo Material */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Cadastrar Novo Material">
        <form onSubmit={handleCreateItem} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Nome do Material" placeholder="Ex: Resina Z350 XT, Anestésico..." value={name} onChange={(e) => setName(e.target.value)} required />

            <Select label="Categoria" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Restauradores">Restauradores</option>
              <option value="Anestésicos">Anestésicos</option>
              <option value="Descartáveis">Descartáveis</option>
              <option value="Cimentos">Cimentos</option>
              <option value="Instrumentais">Instrumentais</option>
            </Select>

            <Input label="Estoque Atual" type="number" placeholder="Ex: 10" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} required />

            <Input label="Estoque Mínimo de Alerta" type="number" placeholder="Ex: 3" value={minStock} onChange={(e) => setMinStock(e.target.value)} required />

            <Input label="Unidade de Medida" placeholder="Ex: Seringa 4g, Caixa 50 un..." value={unit} onChange={(e) => setUnit(e.target.value)} required />

            <Input label="Data de Validade" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
          </div>

          <Input label="Fornecedor Principal" placeholder="Ex: Dental Cremer, Surya Dental..." value={supplier} onChange={(e) => setSupplier(e.target.value)} required />

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar Material</Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Movimentação Rápida */}
      <Modal isOpen={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} title="Movimentação de Estoque">
        <form onSubmit={handleMoveStock} className="space-y-6 mt-4">
          <Select label="Material" value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)}>
            {stockItems.map((item) => (
              <option key={item.id} value={item.id}>{item.name} (Atual: {item.currentStock})</option>
            ))}
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select label="Tipo de Movimentação" value={moveType} onChange={(e) => setMoveType(e.target.value as "entrada" | "saida")}>
              <option value="entrada">Entrada (Adicionar ao Estoque)</option>
              <option value="saida">Saída (Consumir / Descartar)</option>
            </Select>

            <Input label="Quantidade" type="number" min="1" placeholder="Ex: 5" value={moveQuantity} onChange={(e) => setMoveQuantity(e.target.value)} required />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" type="button" onClick={() => setIsMoveModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Confirmar Movimentação</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
