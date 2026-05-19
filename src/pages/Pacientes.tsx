import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Search,
  Plus,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  HeartPulse,
  Activity,
  AlertCircle,
  Paperclip,
  Trash2,
  Edit,
  ExternalLink,
} from "lucide-react"
import { useDentalisStore } from "../store/useDentalisStore"
import type { Patient } from "../store/useDentalisStore"
import { formatCPF, formatPhone, formatCurrency, formatDate } from "../utils/formatters"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Badge } from "../components/ui/Badge"
import { Modal } from "../components/ui/Modal"
import { Tabs } from "../components/ui/Tabs"

// Schema Zod para Validação de Novo Paciente
const patientSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  cpf: z.string().min(11, { message: "CPF inválido." }),
  phone: z.string().min(10, { message: "Telefone inválido." }),
  email: z.string().email({ message: "E-mail inválido." }),
  birthDate: z.string().min(1, { message: "Data de nascimento é obrigatória." }),
  gender: z.string().min(1, { message: "Gênero é obrigatório." }),
  covenio: z.string().min(1, { message: "Convênio é obrigatório." }),
  status: z.enum(["ativo", "em_tratamento", "inativo", "alta"]),
  queixaPrincipal: z.string().min(5, { message: "Descreva a queixa principal." }),
  alergias: z.string().min(1, { message: "Informe as alergias (ou 'Nenhuma')." }),
  medicamentos: z.string().min(1, { message: "Informe os medicamentos em uso (ou 'Nenhum')." }),
  doencasPrevias: z.string().min(1, { message: "Informe doenças prévias (ou 'Nenhuma')." }),
  observacoes: z.string().optional(),
})

type PatientFormValues = z.infer<typeof patientSchema>

export const Pacientes: React.FC = () => {
  const { patients, selectedPatientId, setSelectedPatientId, addPatient, deletePatient } = useDentalisStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      status: "ativo",
      covenio: "Particular",
      gender: "Feminino",
      alergias: "Nenhuma",
      medicamentos: "Nenhum",
      doencasPrevias: "Nenhuma",
    },
  })

  // Filtros de busca
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf.includes(searchTerm) ||
      p.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "todos" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0]

  const onSubmit = (data: PatientFormValues) => {
    addPatient({
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      email: data.email,
      birthDate: data.birthDate,
      gender: data.gender,
      covenio: data.covenio,
      status: data.status,
      anamnese: {
        queixaPrincipal: data.queixaPrincipal,
        alergias: data.alergias,
        medicamentos: data.medicamentos,
        doencasPrevias: data.doencasPrevias,
        observacoes: data.observacoes || "",
      },
    })
    reset()
    setIsModalOpen(false)
  }

  const getStatusBadgeVariant = (status: Patient["status"]) => {
    switch (status) {
      case "ativo":
        return "success"
      case "em_tratamento":
        return "primary"
      case "alta":
        return "default"
      case "inativo":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-12rem)] animate-fade-in">
      {/* Coluna Esquerda: Lista de Pacientes (1/3) */}
      <Card className="w-full lg:w-5/12 flex flex-col h-full shadow-sm border border-border/80 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Header e Busca */}
        <div className="p-6 border-b border-border space-y-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Pacientes Cadastrados</h3>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsModalOpen(true)}>
              Novo Paciente
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-white dark:bg-slate-800 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            >
              <option value="todos">Todos Status</option>
              <option value="ativo">Ativo</option>
              <option value="em_tratamento">Em Tratamento</option>
              <option value="alta">Alta</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>

        {/* Lista Virtualizada / Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">Nenhum paciente encontrado.</div>
          ) : (
            filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatient?.id
              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-primary/5 border-primary/30 dark:bg-primary/10 dark:border-primary/40 shadow-sm"
                      : "bg-white dark:bg-slate-800/40 border-border/50 hover:border-border hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      {patient.avatar ? (
                        <img src={patient.avatar} alt={patient.name} className="h-12 w-12 rounded-xl object-cover shadow-sm" />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center font-bold text-primary text-base shadow-sm">
                          {patient.name.charAt(0)}
                        </div>
                      )}
                      <span
                        className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                          patient.status === "ativo"
                            ? "bg-emerald-500"
                            : patient.status === "em_tratamento"
                            ? "bg-blue-500"
                            : patient.status === "alta"
                            ? "bg-purple-500"
                            : "bg-rose-500"
                        }`}
                      />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-1">{patient.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{patient.covenio}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{formatPhone(patient.phone)}</p>
                    </div>
                  </div>

                  <Badge variant={getStatusBadgeVariant(patient.status)} className="capitalize text-[11px]">
                    {patient.status.replace("_", " ")}
                  </Badge>
                </div>
              )
            })
          )}
        </div>
      </Card>

      {/* Coluna Direita: Painel de Detalhes do Paciente (2/3) */}
      <Card className="w-full lg:w-7/12 flex flex-col h-full shadow-sm border border-border/80 bg-white dark:bg-slate-900 overflow-hidden">
        {selectedPatient ? (
          <div className="flex flex-col h-full">
            {/* Cabeçalho do Paciente Selecionado */}
            <div className="p-8 border-b border-border bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-800/40 dark:via-slate-900 dark:to-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {selectedPatient.avatar ? (
                  <img src={selectedPatient.avatar} alt={selectedPatient.name} className="h-20 w-20 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-800" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center font-bold text-primary text-2xl shadow-md border-2 border-white dark:border-slate-800">
                    {selectedPatient.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-foreground tracking-tight">{selectedPatient.name}</h2>
                    <Badge variant={getStatusBadgeVariant(selectedPatient.status)} className="capitalize text-xs">
                      {selectedPatient.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-primary" /> {formatCPF(selectedPatient.cpf)}</span>
                    <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" /> {formatPhone(selectedPatient.phone)}</span>
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-primary" /> {selectedPatient.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <Button variant="outline" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => deletePatient(selectedPatient.id)}>
                  Excluir
                </Button>
              </div>
            </div>

            {/* Abas (Tabs) do Painel */}
            <div className="flex-1 flex flex-col overflow-hidden p-8">
              <Tabs
                tabs={[
                  {
                    id: "anamnese",
                    label: "Anamnese & Histórico Clínico",
                    content: (
                      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-28rem)] pr-2">
                        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-6">
                          <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4" /> Queixa Principal
                          </h4>
                          <p className="text-sm text-foreground font-medium leading-relaxed">{selectedPatient.anamnese.queixaPrincipal}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-slate-50 dark:bg-slate-800/50 border border-border/80 rounded-2xl p-6 space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <AlertCircle className="h-3.5 w-3.5 text-rose-500" /> Alergias
                            </h4>
                            <p className="text-sm font-semibold text-foreground">{selectedPatient.anamnese.alergias}</p>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/50 border border-border/80 rounded-2xl p-6 space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <HeartPulse className="h-3.5 w-3.5 text-indigo-500" /> Medicamentos em Uso
                            </h4>
                            <p className="text-sm font-semibold text-foreground">{selectedPatient.anamnese.medicamentos}</p>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/50 border border-border/80 rounded-2xl p-6 space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-amber-500" /> Doenças Prévias
                            </h4>
                            <p className="text-sm font-semibold text-foreground">{selectedPatient.anamnese.doencasPrevias}</p>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800/50 border border-border/80 rounded-2xl p-6 space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-sky-500" /> Convênio / Plano
                            </h4>
                            <p className="text-sm font-semibold text-foreground">{selectedPatient.covenio}</p>
                          </div>
                        </div>

                        {selectedPatient.anamnese.observacoes && (
                          <div className="bg-slate-50 dark:bg-slate-800/50 border border-border/80 rounded-2xl p-6 space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Observações Adicionais</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{selectedPatient.anamnese.observacoes}</p>
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    id: "timeline",
                    label: "Timeline de Atendimentos",
                    content: (
                      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-28rem)] pr-2 pl-4 border-l-2 border-border/80 ml-4">
                        <div className="relative pl-6 space-y-2">
                          <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-white dark:ring-slate-900" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary">Hoje, 14:30</span>
                            <Badge variant="primary">Em Andamento</Badge>
                          </div>
                          <h5 className="text-sm font-bold text-foreground">Restauração Resina Composta (Dente 46)</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Dra. Beatriz Silva • Duração estimada: 60 min</p>
                        </div>

                        <div className="relative pl-6 space-y-2 opacity-70">
                          <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400">10/04/2026</span>
                            <Badge variant="default">Finalizado</Badge>
                          </div>
                          <h5 className="text-sm font-bold text-foreground">Avaliação Inicial e Profilaxia</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Dra. Beatriz Silva • Limpeza completa e remoção de tártaro.</p>
                        </div>

                        <div className="relative pl-6 space-y-2 opacity-70">
                          <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900" />
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400">15/01/2025</span>
                            <Badge variant="default">Finalizado</Badge>
                          </div>
                          <h5 className="text-sm font-bold text-foreground">Tratamento de Canal (Dente 24)</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Dr. Rodrigo Martinez • Endodontia concluída com sucesso em sessão única.</p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: "documentos",
                    label: "Galeria & Radiografias",
                    content: (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100vh-28rem)] pr-2">
                        <div className="group relative rounded-2xl overflow-hidden border border-border shadow-sm aspect-video bg-slate-100 dark:bg-slate-800">
                          <img
                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=500"
                            alt="Radiografia Panorâmica"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <div className="flex items-center justify-between w-full text-white">
                              <span className="text-xs font-semibold">Panorâmica 2026.jpg</span>
                              <ExternalLink className="h-4 w-4 cursor-pointer hover:text-primary" />
                            </div>
                          </div>
                        </div>

                        <div className="group relative rounded-2xl overflow-hidden border border-border shadow-sm aspect-video bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-6 text-center border-dashed hover:border-primary transition-colors cursor-pointer">
                          <Paperclip className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors mb-2" />
                          <span className="text-sm font-semibold text-foreground">Anexar Novo Exame</span>
                          <span className="text-xs text-slate-400 mt-1">PDF, JPG ou PNG até 20MB</span>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: "financeiro",
                    label: "Histórico Financeiro",
                    content: (
                      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-28rem)] pr-2">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/80">
                          <div>
                            <h5 className="text-sm font-bold text-foreground">Restauração Resina Composta Dente 46</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pago via Pix em {formatDate(new Date().toISOString())}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(380)}</span>
                            <Badge variant="success" className="mt-1 block w-max ml-auto">PAGO</Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/80">
                          <div>
                            <h5 className="text-sm font-bold text-foreground">Tratamento de Canal Dente 24</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pago via Cartão de Crédito em 15/01/2025</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(1200)}</span>
                            <Badge variant="success" className="mt-1 block w-max ml-auto">PAGO</Badge>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Selecione um paciente para ver os detalhes.</div>
        )}
      </Card>

      {/* Modal de Cadastro de Novo Paciente */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Novo Paciente">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Nome Completo" placeholder="Ex: Carlos Eduardo Santos" {...register("name")} error={errors.name?.message} />
            <Input label="CPF" placeholder="Ex: 123.456.789-00" {...register("cpf")} error={errors.cpf?.message} />
            <Input label="Telefone Celular" placeholder="Ex: (11) 98765-4321" {...register("phone")} error={errors.phone?.message} />
            <Input label="E-mail" type="email" placeholder="Ex: carlos@email.com" {...register("email")} error={errors.email?.message} />
            <Input label="Data de Nascimento" type="date" {...register("birthDate")} error={errors.birthDate?.message} />

            <Select label="Gênero" {...register("gender")} error={errors.gender?.message}>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </Select>

            <Select label="Convênio / Plano" {...register("covenio")} error={errors.covenio?.message}>
              <option value="Particular">Particular</option>
              <option value="Unimed Odonto">Unimed Odonto</option>
              <option value="Bradesco Dental">Bradesco Dental</option>
              <option value="SulAmérica">SulAmérica</option>
              <option value="Amil Dental">Amil Dental</option>
            </Select>

            <Select label="Status Inicial" {...register("status")} error={errors.status?.message}>
              <option value="ativo">Ativo</option>
              <option value="em_tratamento">Em Tratamento</option>
              <option value="alta">Alta</option>
              <option value="inativo">Inativo</option>
            </Select>
          </div>

          <div className="border-t border-border pt-6 space-y-6">
            <h4 className="text-sm font-bold text-foreground">Anamnese Inicial</h4>

            <Input label="Queixa Principal" placeholder="Ex: Dor aguda no dente 46 ao mastigar..." {...register("queixaPrincipal")} error={errors.queixaPrincipal?.message} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input label="Alergias" placeholder="Ex: Penicilina ou Nenhuma" {...register("alergias")} error={errors.alergias?.message} />
              <Input label="Medicamentos em Uso" placeholder="Ex: Losartana ou Nenhum" {...register("medicamentos")} error={errors.medicamentos?.message} />
              <Input label="Doenças Prévias" placeholder="Ex: Hipertensão ou Nenhuma" {...register("doencasPrevias")} error={errors.doencasPrevias?.message} />
            </div>

            <Input label="Observações Adicionais (Opcional)" placeholder="Ex: Paciente ansioso, prefere atendimento pela manhã..." {...register("observacoes")} error={errors.observacoes?.message} />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>Salvar Paciente</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
