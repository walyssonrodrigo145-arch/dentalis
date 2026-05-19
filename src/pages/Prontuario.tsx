import React, { useState } from "react"
import {
  FileText,
  Plus,
  Printer,
  Clock,
  Pill,
} from "lucide-react"
import { useDentalisStore } from "../store/useDentalisStore"
import type { ToothState } from "../store/useDentalisStore"
import { formatCPF } from "../utils/formatters"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Badge } from "../components/ui/Badge"
import { Modal } from "../components/ui/Modal"
import { Tabs } from "../components/ui/Tabs"

export const Prontuario: React.FC = () => {
  const { patients, selectedPatientId, setSelectedPatientId, updateToothStatus } = useDentalisStore()
  const [selectedTooth, setSelectedTooth] = useState<ToothState | null>(null)
  const [newStatus, setNewStatus] = useState<ToothState["status"]>("saudavel")
  const [toothNotes, setToothNotes] = useState("")

  // Form de Evolução Clínica
  const [evolucaoTexto, setEvolucaoTexto] = useState("")
  const [evolucoes, setEvolucoes] = useState<Array<{ id: string; data: string; texto: string; dentista: string }>>([
    {
      id: "ev-1",
      data: "19/05/2026 - 15:00",
      texto: "Realizada abertura coronária do dente 46, remoção do tecido cariado e proteção pulpar direta. Restauração provisória em ionômero de vidro.",
      dentista: "Dra. Beatriz Silva",
    },
    {
      id: "ev-2",
      data: "10/04/2026 - 11:15",
      texto: "Exame clínico inicial e profilaxia completa. Paciente queixa-se de sensibilidade no quadrante inferior direito.",
      dentista: "Dra. Beatriz Silva",
    },
  ])

  // Form de Receitas/Atestados
  const [tipoDoc, setTipoDoc] = useState<"receita" | "atestado">("receita")
  const [medicamentoPrescrito, setMedicamentoPrescrito] = useState("Amoxicilina 500mg - Tomar 1 cp a cada 8 horas por 7 dias.\nDipirona 1g - Tomar 1 cp a cada 6 horas em caso de dor.")

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0]

  const handleOpenToothModal = (tooth: ToothState) => {
    setSelectedTooth(tooth)
    setNewStatus(tooth.status)
    setToothNotes(tooth.notes || "")
  }

  const handleSaveToothStatus = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTooth || !selectedPatient) return

    updateToothStatus(selectedPatient.id, selectedTooth.number, newStatus, toothNotes)
    setSelectedTooth(null)
  }

  const handleAddEvolucao = (e: React.FormEvent) => {
    e.preventDefault()
    if (!evolucaoTexto.trim()) return

    const novaEv = {
      id: `ev-${Date.now()}`,
      data: new Date().toLocaleString("pt-BR"),
      texto: evolucaoTexto,
      dentista: "Dra. Beatriz Silva",
    }

    setEvolucoes([novaEv, ...evolucoes])
    setEvolucaoTexto("")
  }

  const getToothColor = (status: ToothState["status"]) => {
    switch (status) {
      case "saudavel":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-border"
      case "carie":
        return "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20 animate-pulse"
      case "restaurado":
        return "bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/20"
      case "extraido":
        return "bg-slate-400 dark:bg-slate-700 text-slate-900 dark:text-slate-400 border-slate-500 line-through opacity-60"
      case "coroa":
        return "bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20"
      case "canal":
        return "bg-purple-500 text-white border-purple-600 shadow-md shadow-purple-500/20"
      case "implante":
        return "bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20"
    }
  }

  // Organização dos Dentes em Quadrantes para o Odontograma
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11]
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28]
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38]
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41]

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Topbar do Prontuário: Seleção de Paciente */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center font-bold text-primary text-lg shadow-sm">
            {selectedPatient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-foreground tracking-tight">{selectedPatient.name}</h3>
              <Badge variant="primary" className="capitalize text-xs">Prontuário Ativo</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              CPF: {formatCPF(selectedPatient.cpf)} • Convênio: {selectedPatient.covenio}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Alternar Paciente:</span>
          <select
            value={selectedPatient.id}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Area: Abas do Prontuário */}
      <Card className="p-8 shadow-sm border border-border/80 bg-white dark:bg-slate-900">
        <Tabs
          tabs={[
            {
              id: "odontograma",
              label: "Odontograma Interativo",
              content: (
                <div className="space-y-10 mt-4">
                  <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-border/60 text-xs">
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700" /> Saudável</div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-500" /> Cárie</div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-500" /> Restaurado</div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" /> Coroa</div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-purple-500" /> Tratamento de Canal</div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" /> Implante</div>
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-400" /> Extraído</div>
                  </div>

                  {/* Representação Gráfica das Arcadas */}
                  <div className="flex flex-col items-center gap-12 max-w-4xl mx-auto py-6">
                    {/* Arcada Superior */}
                    <div className="w-full space-y-4">
                      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-border/50 pb-2">
                        Arcada Superior (Maxilar)
                      </div>
                      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
                        {/* Quadrante 1 (Superior Direito) */}
                        <div className="flex items-center gap-1 sm:gap-2 border-r-2 border-border/80 pr-2 sm:pr-4">
                          {upperRight.map((num) => {
                            const tooth = selectedPatient.teeth[num] || { id: num, number: num, status: "saudavel" }
                            return (
                              <button
                                key={num}
                                onClick={() => handleOpenToothModal(tooth)}
                                className={`h-12 w-10 sm:h-16 sm:w-12 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 group relative ${getToothColor(tooth.status)}`}
                              >
                                <span className="text-[10px] sm:text-xs font-bold opacity-80">{num}</span>
                                <div className="h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-white/20 dark:bg-black/20 mt-1 flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold group-hover:bg-white/40">
                                  {tooth.status.charAt(0).toUpperCase()}
                                </div>
                              </button>
                            )
                          })}
                        </div>

                        {/* Quadrante 2 (Superior Esquerdo) */}
                        <div className="flex items-center gap-1 sm:gap-2 pl-2 sm:pl-4">
                          {upperLeft.map((num) => {
                            const tooth = selectedPatient.teeth[num] || { id: num, number: num, status: "saudavel" }
                            return (
                              <button
                                key={num}
                                onClick={() => handleOpenToothModal(tooth)}
                                className={`h-12 w-10 sm:h-16 sm:w-12 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 group relative ${getToothColor(tooth.status)}`}
                              >
                                <span className="text-[10px] sm:text-xs font-bold opacity-80">{num}</span>
                                <div className="h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-white/20 dark:bg-black/20 mt-1 flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold group-hover:bg-white/40">
                                  {tooth.status.charAt(0).toUpperCase()}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Arcada Inferior */}
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3">
                        {/* Quadrante 4 (Inferior Direito) */}
                        <div className="flex items-center gap-1 sm:gap-2 border-r-2 border-border/80 pr-2 sm:pr-4">
                          {lowerRight.map((num) => {
                            const tooth = selectedPatient.teeth[num] || { id: num, number: num, status: "saudavel" }
                            return (
                              <button
                                key={num}
                                onClick={() => handleOpenToothModal(tooth)}
                                className={`h-12 w-10 sm:h-16 sm:w-12 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 group relative ${getToothColor(tooth.status)}`}
                              >
                                <span className="text-[10px] sm:text-xs font-bold opacity-80">{num}</span>
                                <div className="h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-white/20 dark:bg-black/20 mt-1 flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold group-hover:bg-white/40">
                                  {tooth.status.charAt(0).toUpperCase()}
                                </div>
                              </button>
                            )
                          })}
                        </div>

                        {/* Quadrante 3 (Inferior Esquerdo) */}
                        <div className="flex items-center gap-1 sm:gap-2 pl-2 sm:pl-4">
                          {lowerLeft.map((num) => {
                            const tooth = selectedPatient.teeth[num] || { id: num, number: num, status: "saudavel" }
                            return (
                              <button
                                key={num}
                                onClick={() => handleOpenToothModal(tooth)}
                                className={`h-12 w-10 sm:h-16 sm:w-12 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 group relative ${getToothColor(tooth.status)}`}
                              >
                                <span className="text-[10px] sm:text-xs font-bold opacity-80">{num}</span>
                                <div className="h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-white/20 dark:bg-black/20 mt-1 flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold group-hover:bg-white/40">
                                  {tooth.status.charAt(0).toUpperCase()}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mt-2 border-t border-border/50 pt-2">
                        Arcada Inferior (Mandíbula)
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-400">
                    💡 Clique em qualquer dente acima para registrar tratamentos, cáries, restaurações ou observações específicas.
                  </div>
                </div>
              ),
            },
            {
              id: "evolucao",
              label: "Evolução Clínica",
              content: (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                  {/* Formulário de Nova Evolução (1/3) */}
                  <Card className="p-6 shadow-sm border border-border/80 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col justify-between h-max">
                    <form onSubmit={handleAddEvolucao} className="space-y-4">
                      <h4 className="text-sm font-bold text-foreground">Registrar Nova Evolução</h4>
                      <textarea
                        rows={5}
                        placeholder="Descreva detalhadamente os procedimentos realizados na sessão de hoje, materiais utilizados e resposta do paciente..."
                        value={evolucaoTexto}
                        onChange={(e) => setEvolucaoTexto(e.target.value)}
                        className="w-full p-3 rounded-xl border border-border bg-white dark:bg-slate-800 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none"
                        required
                      />
                      <Button variant="primary" type="submit" className="w-full" leftIcon={<Plus className="h-4 w-4" />}>
                        Salvar Evolução
                      </Button>
                    </form>
                  </Card>

                  {/* Histórico de Evoluções (2/3) */}
                  <div className="lg:col-span-2 space-y-4 overflow-y-auto max-h-[500px] pr-2">
                    <h4 className="text-sm font-bold text-foreground mb-4">Histórico de Atendimentos</h4>
                    {evolucoes.map((ev) => (
                      <div key={ev.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-border/80 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="text-xs font-bold text-primary flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {ev.data}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{ev.dentista}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{ev.texto}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              id: "receitas",
              label: "Receitas & Atestados",
              content: (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                  {/* Controles de Geração */}
                  <Card className="p-6 shadow-sm border border-border/80 bg-slate-50/50 dark:bg-slate-800/20 space-y-6">
                    <h4 className="text-sm font-bold text-foreground">Gerador Digital de Documentos</h4>

                    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-border">
                      <button
                        type="button"
                        onClick={() => setTipoDoc("receita")}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          tipoDoc === "receita" ? "bg-primary text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        <Pill className="h-4 w-4" /> Receituário
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoDoc("atestado")}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          tipoDoc === "atestado" ? "bg-primary text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        <FileText className="h-4 w-4" /> Atestado Odontológico
                      </button>
                    </div>

                    {tipoDoc === "receita" ? (
                      <div className="space-y-4">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block">Prescrição de Medicamentos:</label>
                        <textarea
                          rows={6}
                          value={medicamentoPrescrito}
                          onChange={(e) => setMedicamentoPrescrito(e.target.value)}
                          className="w-full p-3 rounded-xl border border-border bg-white dark:bg-slate-800 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block">Texto do Atestado:</label>
                        <textarea
                          rows={6}
                          defaultValue={`Atesto para os devidos fins que o(a) paciente ${selectedPatient.name}, esteve sob tratamento odontológico nesta clínica no dia de hoje, necessitando de 1 (um) dia de repouso por motivos de cirurgia oral menor.`}
                          className="w-full p-3 rounded-xl border border-border bg-white dark:bg-slate-800 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-none"
                        />
                      </div>
                    )}

                    <Button variant="primary" className="w-full" leftIcon={<Printer className="h-4 w-4" />} onClick={() => alert("Simulação: Documento enviado para a impressora / Gerado PDF com sucesso!")}>
                      Imprimir / Gerar PDF
                    </Button>
                  </Card>

                  {/* Preview do Documento */}
                  <Card className="p-8 shadow-lg border border-border bg-white text-slate-900 min-h-[500px] flex flex-col justify-between font-serif relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-3 bg-primary" />
                    <div className="text-center border-b border-slate-200 pb-6 mt-4 space-y-1">
                      <h3 className="text-xl font-bold tracking-tight text-primary font-sans">CLÍNICA DENTALIS PREMIUM</h3>
                      <p className="text-xs text-slate-500 font-sans">Dra. Beatriz Silva • CRO-SP 12345</p>
                      <p className="text-xs text-slate-400 font-sans">Av. Brigadeiro Faria Lima, 3064 - São Paulo / SP</p>
                    </div>

                    <div className="flex-1 my-8 space-y-6">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 uppercase font-sans tracking-wider block">Paciente</span>
                        <h4 className="text-base font-bold text-slate-800 font-sans">{selectedPatient.name}</h4>
                      </div>

                      <div className="space-y-4">
                        <span className="text-xs text-slate-400 uppercase font-sans tracking-wider block">
                          {tipoDoc === "receita" ? "Prescrição" : "Declaração"}
                        </span>
                        <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed border-l-2 border-primary/30 pl-4 py-2">
                          {tipoDoc === "receita" ? medicamentoPrescrito : `Atesto para os devidos fins que o(a) paciente ${selectedPatient.name}, esteve sob tratamento odontológico nesta clínica no dia de hoje, necessitando de 1 (um) dia de repouso por motivos de cirurgia oral menor.`}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-6 flex flex-col items-center justify-center text-center space-y-2">
                      <div className="w-48 h-px bg-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-700 font-sans">Dra. Beatriz Silva</span>
                      <span className="text-[10px] text-slate-400 font-sans">Cirurgiã-Dentista • CRO-SP 12345</span>
                      <span className="text-[10px] text-slate-400 font-sans mt-4">São Paulo, {new Date().toLocaleDateString("pt-BR")}</span>
                    </div>
                  </Card>
                </div>
              ),
            },
            {
              id: "comparador",
              label: "Comparador Antes / Depois",
              content: (
                <div className="space-y-6 mt-4">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <h4 className="text-base font-bold text-foreground">Acompanhamento Visual de Resultados</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Arraste a barra lateral ou visualize o comparativo direto do tratamento estético/ortodôntico.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-4 shadow-sm border border-border/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="warning">Antes do Tratamento</Badge>
                        <span className="text-xs text-slate-400">10/01/2026</span>
                      </div>
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-border shadow-inner">
                        <img src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600" alt="Antes" className="w-full h-full object-cover" />
                      </div>
                    </Card>

                    <Card className="p-4 shadow-sm border border-border/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="success">Depois (Resultado Atual)</Badge>
                        <span className="text-xs text-slate-400">19/05/2026</span>
                      </div>
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-border shadow-inner">
                        <img src="https://images.unsplash.com/photo-1555820585-c5ae44394b79?auto=format&fit=crop&q=80&w=600" alt="Depois" className="w-full h-full object-cover" />
                      </div>
                    </Card>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Modal de Atualização do Dente no Odontograma */}
      <Modal isOpen={!!selectedTooth} onClose={() => setSelectedTooth(null)} title={`Gerenciar Dente ${selectedTooth?.number}`}>
        <form onSubmit={handleSaveToothStatus} className="space-y-6 mt-4">
          <Select label="Status Clínico do Dente" value={newStatus} onChange={(e) => setNewStatus(e.target.value as ToothState["status"])}>
            <option value="saudavel">Saudável</option>
            <option value="carie">Cárie / Lesão</option>
            <option value="restaurado">Restaurado / Resina</option>
            <option value="coroa">Coroa Prótese</option>
            <option value="canal">Tratamento de Canal</option>
            <option value="implante">Implante</option>
            <option value="extraido">Extraído / Ausente</option>
          </Select>

          <Input label="Observações do Dente (Opcional)" placeholder="Ex: Restauração oclusal profunda, resina Z350..." value={toothNotes} onChange={(e) => setToothNotes(e.target.value)} />

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" type="button" onClick={() => setSelectedTooth(null)}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
