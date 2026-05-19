import React, { useState } from "react"
import {
  Users,
  Plus,
  UserCheck,
  Shield,
  Award,
  Clock,
  Mail,
  Phone,
  Edit,
  DollarSign,
} from "lucide-react"
import { useDentalisStore } from "../store/useDentalisStore"
import type { TeamMember } from "../store/useDentalisStore"
import { formatPhone } from "../utils/formatters"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Badge } from "../components/ui/Badge"
import { Modal } from "../components/ui/Modal"

export const Equipe: React.FC = () => {
  const { teamMembers, addTeamMember } = useDentalisStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState("todos")

  // Form Novo Membro
  const [name, setName] = useState("")
  const [role, setRole] = useState<TeamMember["role"]>("dentista")
  const [registro, setRegistro] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [status, setStatus] = useState<TeamMember["status"]>("ativo")

  const filteredMembers = teamMembers.filter((m) => roleFilter === "todos" || m.role === roleFilter)

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    addTeamMember({
      name,
      role,
      registro: role === "dentista" ? registro : undefined,
      phone,
      email,
      specialty: role === "dentista" ? specialty : undefined,
      status,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    })

    setIsModalOpen(false)
    setName("")
    setEmail("")
    setPhone("")
    setRegistro("")
    setSpecialty("")
  }

  const getRoleBadge = (role: TeamMember["role"]) => {
    switch (role) {
      case "dentista":
        return <Badge variant="primary" className="flex items-center gap-1"><Award className="h-3 w-3" /> Dentista</Badge>
      case "recepcao":
        return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Recepção</Badge>
      case "assistente":
        return <Badge variant="success" className="flex items-center gap-1"><UserCheck className="h-3 w-3" /> Assistente</Badge>
      case "admin":
        return <Badge variant="destructive" className="flex items-center gap-1"><Shield className="h-3 w-3" /> Administrador</Badge>
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Topbar da Equipe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Gestão da Equipe & Permissões</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Controle de profissionais, níveis de acesso ao sistema, metas mensais e comissões.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="todos">Todos os Cargos</option>
            <option value="dentista">Dentistas</option>
            <option value="recepcao">Recepção</option>
            <option value="assistente">Assistentes</option>
            <option value="admin">Administradores</option>
          </select>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsModalOpen(true)}>
            Novo Membro
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <Badge variant="primary">Total</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total da Equipe</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{teamMembers.length} profissionais</h3>
          <p className="text-xs text-slate-400 mt-2">Cadastrados no sistema</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <Badge variant="success">Ativos</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Dentistas</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{teamMembers.filter((m) => m.role === "dentista").length} especialistas</h3>
          <p className="text-xs text-slate-400 mt-2">Comissionamento configurado</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6" />
            </div>
            <Badge variant="warning">Atendimento</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Recepção & Apoio</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">{teamMembers.filter((m) => m.role === "recepcao").length} colaboradores</h3>
          <p className="text-xs text-slate-400 mt-2">Gestão de agenda e pacientes</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6" />
            </div>
            <Badge variant="destructive">Nível Máximo</Badge>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Administradores</span>
          <h3 className="text-2xl font-bold text-foreground mt-1">1 gestor</h3>
          <p className="text-xs text-slate-400 mt-2">Acesso irrestrito a finanças</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Card>
      </div>

      {/* Main Grid: Lista de Equipe & Painel de Metas/Comissões */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Listagem de Membros (2 Colunas) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-foreground mb-4">Profissionais da Clínica</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="p-6 shadow-sm border border-border/80 flex flex-col justify-between hover:shadow-md transition-shadow group">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <img src={member.avatar} alt={member.name} className="h-16 w-16 rounded-2xl object-cover shadow-sm border border-border" />
                    <div className="flex flex-col items-end gap-1.5">
                      {getRoleBadge(member.role)}
                      <Badge variant={member.status === "ativo" ? "success" : member.status === "ferias" ? "warning" : "default"} className="text-[10px]">
                        {member.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{member.name}</h4>
                  {member.specialty && <p className="text-xs font-semibold text-primary mt-0.5">{member.specialty}</p>}
                  {member.registro && <p className="text-xs text-slate-400 mt-0.5">{member.registro}</p>}

                  <div className="space-y-1.5 mt-4 pt-4 border-t border-border/60 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-400" /> {member.email}</span>
                    <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-400" /> {formatPhone(member.phone)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/60">
                  <span className="text-xs font-medium text-slate-400">Horário: 08:00 - 18:00</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => alert(`Simulação: Editando permissões de ${member.name}`)}>
                      <Edit className="h-4 w-4 text-slate-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Painel de Metas e Comissões (1 Coluna) */}
        <Card className="p-6 shadow-sm border border-border/80 bg-white dark:bg-slate-900 flex flex-col justify-between h-max">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-foreground">Metas & Comissões</h3>
              <Badge variant="primary">Maio 2026</Badge>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>Dra. Beatriz Silva</span>
                  <span className="text-primary">82% da meta</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Meta: R$ 30.000</span>
                  <span>Alcançado: R$ 24.600</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-foreground">
                  <span>Dr. Rodrigo Martinez</span>
                  <span className="text-primary">95% da meta</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "95%" }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Meta: R$ 25.000</span>
                  <span>Alcançado: R$ 23.750</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 space-y-3">
                <h4 className="text-xs font-bold text-primary flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Regra de Comissionamento</h4>
                <p className="text-xs text-foreground leading-relaxed">
                  Os profissionais cadastrados como <strong>Dentistas</strong> recebem comissão padrão de <strong>35%</strong> sobre procedimentos clínicos e <strong>40%</strong> sobre próteses/implantes após a quitação da fatura.
                </p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-6" onClick={() => alert("Simulação: Regras de comissionamento atualizadas com sucesso!")}>
            Configurar Regras de Comissão
          </Button>
        </Card>
      </div>

      {/* Modal Novo Membro */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Novo Profissional / Colaborador">
        <form onSubmit={handleCreateMember} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Nome Completo" placeholder="Ex: Dr. Carlos, Ana Clara..." value={name} onChange={(e) => setName(e.target.value)} required />

            <Select label="Cargo / Nível de Acesso" value={role} onChange={(e) => setRole(e.target.value as "dentista" | "recepcao" | "assistente" | "admin")}>
              <option value="dentista">Dentista Especialista</option>
              <option value="recepcao">Recepção / Atendimento</option>
              <option value="assistente">Assistente de Saúde Bucal (ASB)</option>
              <option value="admin">Administrador Geral</option>
            </Select>

            {role === "dentista" && (
              <>
                <Input label="Registro Profissional (CRO)" placeholder="Ex: CRO-SP 12345" value={registro} onChange={(e) => setRegistro(e.target.value)} required />
                <Input label="Especialidade Principal" placeholder="Ex: Ortodontia, Implantodontia..." value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
              </>
            )}

            <Input label="Telefone Celular" placeholder="Ex: (11) 98877-6655" value={phone} onChange={(e) => setPhone(e.target.value)} required />

            <Input label="E-mail de Acesso" type="email" placeholder="Ex: profissional@dentalis.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value as "ativo" | "ferias" | "inativo")}>
              <option value="ativo">Ativo</option>
              <option value="ferias">Em Férias</option>
              <option value="inativo">Inativo</option>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Salvar Profissional</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
