import React, { useState } from "react"
import {
  MessageSquare,
  Send,
  Plus,
  Users,
  TrendingUp,
  Percent,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react"
import { useDentalisStore } from "../store/useDentalisStore"
import { formatCurrency } from "../utils/formatters"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Badge } from "../components/ui/Badge"
import { Modal } from "../components/ui/Modal"

export const Marketing: React.FC = () => {
  const { patients } = useDentalisStore()
  const [isCampanhaModalOpen, setIsCampanhaModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"regua" | "campanhas">("regua")

  // Form Nova Campanha
  const [nomeCampanha, setNomeCampanha] = useState("")
  const [publicoAlvo, setPublicoAlvo] = useState("inativos")
  const [mensagemCampanha, setMensagemCampanha] = useState("Olá {nome_paciente}! Notamos que faz um tempo desde sua última visita. Que tal agendar uma avaliação de rotina com condição especial este mês?")

  // Form Regua de Relacionamento
  const [msgConfirmacao, setMsgConfirmacao] = useState("Olá {nome_paciente}, confirmamos sua consulta na Dentalis Premium para o dia {data_consulta} às {hora_consulta}. Responda SIM para confirmar.")
  const [msgRetorno, setMsgRetorno] = useState("Olá {nome_paciente}, já se passaram 6 meses desde sua última limpeza dental. Vamos agendar seu retorno preventivo?")
  const [msgAniversario, setMsgAniversario] = useState("Parabéns {nome_paciente}! A equipe Dentalis Premium deseja um feliz aniversário e muitos motivos para sorrir! 🥳")

  const [campanhas, setCampanhas] = useState([
    {
      id: "camp-1",
      nome: "Reativação de Pacientes Inativos (Semestre 1)",
      publico: "Pacientes sem consulta há mais de 6 meses",
      enviados: 142,
      convertidos: 28,
      receitaGerada: 14500,
      status: "concluida",
    },
    {
      id: "camp-2",
      nome: "Campanha de Clareamento de Inverno",
      publico: "Pacientes ativos interessados em estética",
      enviados: 85,
      convertidos: 18,
      receitaGerada: 22500,
      status: "ativa",
    },
  ])

  const handleCreateCampanha = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomeCampanha || !mensagemCampanha) return

    const novaCamp = {
      id: `camp-${Date.now()}`,
      nome: nomeCampanha,
      publico: publicoAlvo === "inativos" ? "Pacientes sem consulta há mais de 6 meses" : "Todos os pacientes ativos",
      enviados: publicoAlvo === "inativos" ? patients.filter((p) => p.status === "inativo").length || 45 : patients.length,
      convertidos: 0,
      receitaGerada: 0,
      status: "ativa",
    }

    setCampanhas([novaCamp, ...campanhas])
    setIsCampanhaModalOpen(false)
    setNomeCampanha("")
    alert(`Simulação: Campanha disparada com sucesso para ${novaCamp.enviados} pacientes via WhatsApp!`)
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Topbar de Marketing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Marketing & Automação de WhatsApp</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Régua de relacionamento automatizada, disparo de mensagens e campanhas de reativação.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-border">
            <button
              onClick={() => setActiveTab("regua")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "regua" ? "bg-white dark:bg-slate-900 text-foreground shadow-sm" : "text-slate-500 hover:text-foreground"
              }`}
            >
              Régua Automática
            </button>
            <button
              onClick={() => setActiveTab("campanhas")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "campanhas" ? "bg-white dark:bg-slate-900 text-foreground shadow-sm" : "text-slate-500 hover:text-foreground"
              }`}
            >
              Campanhas Ativas
            </button>
          </div>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsCampanhaModalOpen(true)}>
            Nova Campanha
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6" />
            </div>
            <Badge variant="success">WhatsApp</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Mensagens Enviadas</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">1.482</h3>
          <p className="text-xs text-slate-400 mt-2">Confirmações e lembretes no mês</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Percent className="h-6 w-6" />
            </div>
            <Badge variant="primary"><ArrowUpRight className="h-3 w-3" /> +5%</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Taxa de Resposta</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">86.4%</h3>
          <p className="text-xs text-slate-400 mt-2">Pacientes confirmam via bot</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <Badge variant="success">Reativados</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Pacientes Recuperados</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">46 pacientes</h3>
          <p className="text-xs text-slate-400 mt-2">Retornaram após campanhas</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <Badge variant="primary">ROI</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Receita de Campanhas</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(37000)}</h3>
          <p className="text-xs text-slate-400 mt-2">Gerado por ações de marketing</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>
      </div>

      {/* Main Area */}
      <Card className="p-8 shadow-sm border border-border/80 bg-white dark:bg-slate-900 min-h-[500px]">
        {activeTab === "regua" ? (
          <div className="space-y-8 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">Régua de Relacionamento (Gatilhos Automáticos)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure os templates enviados automaticamente pelo sistema via WhatsApp.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => alert("Simulação: Configurações da régua salvas com sucesso!")}>
                Salvar Alterações
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Confirmação de Consulta */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/80 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Confirmação</span>
                    <Badge variant="success">Ativo</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Lembrete de Agendamento</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enviado 24 horas antes do atendimento agendado.</p>
                </div>

                <textarea
                  rows={5}
                  value={msgConfirmacao}
                  onChange={(e) => setMsgConfirmacao(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none font-mono"
                />

                <Button variant="secondary" size="sm" className="w-full" onClick={() => alert(`Simulação: Disparando teste para seu número:\n\n"${msgConfirmacao}"`)}>
                  Testar Disparo
                </Button>
              </div>

              {/* Lembrete de Retorno */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/80 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5"><Clock className="h-4 w-4" /> Retorno</span>
                    <Badge variant="success">Ativo</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Recolhimento Semestral</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enviado 6 meses após a última profilaxia/consulta.</p>
                </div>

                <textarea
                  rows={5}
                  value={msgRetorno}
                  onChange={(e) => setMsgRetorno(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none font-mono"
                />

                <Button variant="secondary" size="sm" className="w-full" onClick={() => alert(`Simulação: Disparando teste para seu número:\n\n"${msgRetorno}"`)}>
                  Testar Disparo
                </Button>
              </div>

              {/* Felicitações de Aniversário */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/80 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> Aniversário</span>
                    <Badge variant="success">Ativo</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">Mensagem de Aniversário</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enviado automaticamente às 09:00 no dia do aniversário.</p>
                </div>

                <textarea
                  rows={5}
                  value={msgAniversario}
                  onChange={(e) => setMsgAniversario(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-white dark:bg-slate-900 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none font-mono"
                />

                <Button variant="secondary" size="sm" className="w-full" onClick={() => alert(`Simulação: Disparando teste para seu número:\n\n"${msgAniversario}"`)}>
                  Testar Disparo
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 flex items-center gap-3 text-xs text-foreground">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <span>
                <strong>Tags Dinâmicas Disponíveis:</strong> Utilize <code>{`{nome_paciente}`}</code>, <code>{`{data_consulta}`}</code>, <code>{`{hora_consulta}`}</code>, <code>{`{nome_dentista}`}</code> para personalizar as mensagens.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">Campanhas de Reativação e Vendas</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Acompanhe o retorno sobre o investimento (ROI) de cada disparo em massa.</p>
              </div>
            </div>

            <div className="space-y-4">
              {campanhas.map((camp) => (
                <div key={camp.id} className="p-6 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-base font-bold text-foreground">{camp.nome}</h4>
                      <Badge variant={camp.status === "ativa" ? "primary" : "default"} className="uppercase text-[10px]">
                        {camp.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Público: {camp.publico}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="text-center">
                      <span className="text-xs text-slate-400 block">Enviados</span>
                      <span className="text-sm font-bold text-foreground">{camp.enviados}</span>
                    </div>

                    <div className="text-center border-l border-border pl-6">
                      <span className="text-xs text-slate-400 block">Convertidos</span>
                      <span className="text-sm font-bold text-primary">{camp.convertidos} pac.</span>
                    </div>

                    <div className="text-center border-l border-border pl-6">
                      <span className="text-xs text-slate-400 block">Receita Gerada</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(camp.receitaGerada)}</span>
                    </div>

                    <div className="flex items-center gap-2 border-l border-border pl-6">
                      <Button variant="outline" size="sm" onClick={() => alert(`Simulação: Reenviando campanha "${camp.nome}" para não abertos.`)}>
                        Reenviar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Modal Nova Campanha */}
      <Modal isOpen={isCampanhaModalOpen} onClose={() => setIsCampanhaModalOpen(false)} title="Criar Nova Campanha de WhatsApp">
        <form onSubmit={handleCreateCampanha} className="space-y-6 mt-4">
          <Input label="Nome da Campanha" placeholder="Ex: Reativação de Inverno, Promoção Clareamento..." value={nomeCampanha} onChange={(e) => setNomeCampanha(e.target.value)} required />

          <Select label="Público Alvo" value={publicoAlvo} onChange={(e) => setPublicoAlvo(e.target.value)}>
            <option value="inativos">Pacientes Inativos (Sem consulta há &gt; 6 meses)</option>
            <option value="todos">Todos os Pacientes Ativos</option>
          </Select>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block">Mensagem da Campanha</label>
            <textarea
              rows={5}
              value={mensagemCampanha}
              onChange={(e) => setMensagemCampanha(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-white dark:bg-slate-800 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none font-mono"
              required
            />
            <span className="text-[11px] text-slate-400 block">Dica: Use {`{nome_paciente}`} para personalizar a saudação.</span>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" type="button" onClick={() => setIsCampanhaModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" leftIcon={<Send className="h-4 w-4" />}>Disparar Campanha</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
