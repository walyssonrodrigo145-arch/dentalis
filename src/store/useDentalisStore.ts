import { create } from "zustand"

export interface ToothState {
  id: number
  number: number
  status: "saudavel" | "carie" | "restaurado" | "extraido" | "coroa" | "canal" | "implante"
  notes?: string
}

export interface Patient {
  id: string
  name: string
  cpf: string
  phone: string
  email: string
  birthDate: string
  gender: string
  covenio: string
  status: "ativo" | "em_tratamento" | "inativo" | "alta"
  avatar?: string
  anamnese: {
    queixaPrincipal: string
    alergias: string
    medicamentos: string
    doencasPrevias: string
    observacoes: string
  }
  teeth: Record<number, ToothState>
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  dentistId: string
  dentistName: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  duration: number // minutos
  status: "confirmado" | "aguardando" | "em_atendimento" | "finalizado" | "falta"
  procedure: string
  notes?: string
}

export interface FinanceTransaction {
  id: string
  patientId?: string
  patientName?: string
  description: string
  amount: number
  dueDate: string // YYYY-MM-DD
  paymentDate?: string
  status: "pago" | "pendente" | "atrasado"
  method: "pix" | "cartao" | "boleto"
  type: "receita" | "despesa"
  category: string
}

export interface StockItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  unit: string
  expiryDate: string // YYYY-MM-DD
  supplier: string
  status: "normal" | "alerta" | "critico"
}

export interface TeamMember {
  id: string
  name: string
  role: "dentista" | "recepcao" | "assistente" | "admin"
  registro?: string // CRO
  phone: string
  email: string
  specialty?: string
  status: "ativo" | "inativo" | "ferias"
  avatar: string
}

interface DentalisStore {
  // State
  patients: Patient[]
  appointments: Appointment[]
  transactions: FinanceTransaction[]
  stockItems: StockItem[]
  teamMembers: TeamMember[]
  selectedPatientId: string | null

  // Actions
  fetchData: () => Promise<void>
  setSelectedPatientId: (id: string | null) => void
  addPatient: (patient: Omit<Patient, "id" | "teeth">) => Promise<void>
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>
  deletePatient: (id: string) => Promise<void>
  updateToothStatus: (patientId: string, toothNumber: number, status: ToothState["status"], notes?: string) => Promise<void>

  addAppointment: (appointment: Omit<Appointment, "id">) => Promise<void>
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => Promise<void>
  deleteAppointment: (id: string) => Promise<void>

  addTransaction: (transaction: Omit<FinanceTransaction, "id">) => Promise<void>
  updateTransactionStatus: (id: string, status: FinanceTransaction["status"]) => Promise<void>

  addStockItem: (item: Omit<StockItem, "id">) => Promise<void>
  updateStockItem: (id: string, data: Partial<StockItem>) => Promise<void>
  deleteStockItem: (id: string) => Promise<void>

  addTeamMember: (member: Omit<TeamMember, "id">) => Promise<void>
  updateTeamMember: (id: string, data: Partial<TeamMember>) => Promise<void>
}

// Helper para gerar dentes iniciais (11-18, 21-28, 31-38, 41-48)
const generateInitialTeeth = (): Record<number, ToothState> => {
  const teeth: Record<number, ToothState> = {}
  const quadrants = [1, 2, 3, 4]
  quadrants.forEach((q) => {
    for (let i = 1; i <= 8; i++) {
      const num = q * 10 + i
      teeth[num] = { id: num, number: num, status: "saudavel" }
    }
  })
  return teeth
}

// MOCK DATA INICIAL RICO
const initialPatients: Patient[] = [
  {
    id: "pat-1",
    name: "Carlos Eduardo Santos",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    email: "carlos.santos@email.com",
    birthDate: "1985-06-15",
    gender: "Masculino",
    covenio: "Particular",
    status: "em_tratamento",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    anamnese: {
      queixaPrincipal: "Dor aguda no dente 46 ao mastigar e sensibilidade a frios.",
      alergias: "Nenhuma conhecida",
      medicamentos: "Losartana 50mg",
      doencasPrevias: "Hipertensão controlada",
      observacoes: "Paciente ansioso, prefere atendimento no período da manhã.",
    },
    teeth: {
      ...generateInitialTeeth(),
      16: { id: 16, number: 16, status: "restaurado", notes: "Resina composta há 2 anos" },
      24: { id: 24, number: 24, status: "canal", notes: "Endodontia realizada em 2023" },
      46: { id: 46, number: 46, status: "carie", notes: "Cárie profunda na face oclusal" },
    },
  },
  {
    id: "pat-2",
    name: "Mariana Costa Albuquerque",
    cpf: "987.654.321-11",
    phone: "(11) 91234-5678",
    email: "mariana.costa@email.com",
    birthDate: "1992-09-28",
    gender: "Feminino",
    covenio: "Unimed Odonto",
    status: "ativo",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    anamnese: {
      queixaPrincipal: "Deseja realizar clareamento dental e profilaxia de rotina.",
      alergias: "Penicilina",
      medicamentos: "Nenhum",
      doencasPrevias: "Nenhuma",
      observacoes: "Ótima higiene bucal.",
    },
    teeth: {
      ...generateInitialTeeth(),
      11: { id: 11, number: 11, status: "saudavel" },
      12: { id: 12, number: 12, status: "saudavel" },
      36: { id: 36, number: 36, status: "restaurado", notes: "Restauração oclusal rasa" },
    },
  },
  {
    id: "pat-3",
    name: "Roberto Almeida Fernandes",
    cpf: "456.789.123-22",
    phone: "(11) 97788-9900",
    email: "roberto.almeida@email.com",
    birthDate: "1973-03-10",
    gender: "Masculino",
    covenio: "Bradesco Dental",
    status: "em_tratamento",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    anamnese: {
      queixaPrincipal: "Avaliação para implante no dente 36 perdido há 1 ano.",
      alergias: "Nenhuma",
      medicamentos: "Atenolol",
      doencasPrevias: "Nenhuma",
      observacoes: "Requer avaliação óssea prévia por tomografia.",
    },
    teeth: {
      ...generateInitialTeeth(),
      36: { id: 36, number: 36, status: "extraido", notes: "Perda dentária por fratura radicular" },
      47: { id: 47, number: 47, status: "coroa", notes: "Coroa metalocerâmica" },
    },
  },
  {
    id: "pat-4",
    name: "Juliana Mendes Garcia",
    cpf: "321.654.987-33",
    phone: "(11) 95544-3322",
    email: "juliana.mendes@email.com",
    birthDate: "2001-12-05",
    gender: "Feminino",
    covenio: "Particular",
    status: "alta",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    anamnese: {
      queixaPrincipal: "Finalizou tratamento ortodôntico, acompanhamento de contenção.",
      alergias: "Nenhuma",
      medicamentos: "Nenhum",
      doencasPrevias: "Nenhuma",
      observacoes: "Paciente muito colaborativa.",
    },
    teeth: generateInitialTeeth(),
  },
]

const initialAppointments: Appointment[] = [
  {
    id: "apt-1",
    patientId: "pat-1",
    patientName: "Carlos Eduardo Santos",
    dentistId: "den-1",
    dentistName: "Dra. Beatriz Silva",
    date: new Date().toISOString().split("T")[0], // Hoje
    time: "14:30",
    duration: 60,
    status: "confirmado",
    procedure: "Restauração Resina Composta (Dente 46)",
    notes: "Paciente relatou dor aguda, usar anestésico sem vasoconstritor.",
  },
  {
    id: "apt-2",
    patientId: "pat-2",
    patientName: "Mariana Costa Albuquerque",
    dentistId: "den-1",
    dentistName: "Dra. Beatriz Silva",
    date: new Date().toISOString().split("T")[0], // Hoje
    time: "16:00",
    duration: 45,
    status: "em_atendimento",
    procedure: "Sessão 1: Clareamento a Laser + Profilaxia",
    notes: "Registrar cor inicial da escala Vita.",
  },
  {
    id: "apt-3",
    patientId: "pat-3",
    patientName: "Roberto Almeida Fernandes",
    dentistId: "den-2",
    dentistName: "Dr. Rodrigo Martinez",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Amanhã
    time: "10:00",
    duration: 90,
    status: "aguardando",
    procedure: "Avaliação Cirúrgica Implante Dente 36",
    notes: "Analisar tomografia computadorizada.",
  },
  {
    id: "apt-4",
    patientId: "pat-4",
    patientName: "Juliana Mendes Garcia",
    dentistId: "den-1",
    dentistName: "Dra. Beatriz Silva",
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0], // Depois de amanhã
    time: "11:30",
    duration: 30,
    status: "confirmado",
    procedure: "Revisão Contenção Ortodôntica",
  },
]

const initialTransactions: FinanceTransaction[] = [
  {
    id: "tx-1",
    patientId: "pat-1",
    patientName: "Carlos Eduardo Santos",
    description: "Restauração Resina Composta Dente 46",
    amount: 380.0,
    dueDate: new Date().toISOString().split("T")[0],
    paymentDate: new Date().toISOString().split("T")[0],
    status: "pago",
    method: "pix",
    type: "receita",
    category: "Procedimentos Clínicos",
  },
  {
    id: "tx-2",
    patientId: "pat-2",
    patientName: "Mariana Costa Albuquerque",
    description: "Pacote Clareamento Dental + Profilaxia",
    amount: 1250.0,
    dueDate: new Date().toISOString().split("T")[0],
    status: "pendente",
    method: "cartao",
    type: "receita",
    category: "Estética",
  },
  {
    id: "tx-3",
    patientId: "pat-3",
    patientName: "Roberto Almeida Fernandes",
    description: "Exame Tomografia + Planejamento Implante",
    amount: 450.0,
    dueDate: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0], // 3 dias atrás
    status: "atrasado",
    method: "boleto",
    type: "receita",
    category: "Exames e Diagnósticos",
  },
  {
    id: "tx-4",
    description: "Aquisição de Resinas Compostas (Dental Cremer)",
    amount: 1850.0,
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    status: "pendente",
    method: "boleto",
    type: "despesa",
    category: "Fornecedores e Materiais",
  },
  {
    id: "tx-5",
    description: "Manutenção Preventiva das Cadeiras e Compressor",
    amount: 920.0,
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString().split("T")[0],
    paymentDate: new Date(Date.now() - 86400000 * 1).toISOString().split("T")[0],
    status: "pago",
    method: "pix",
    type: "despesa",
    category: "Manutenção e Equipamentos",
  },
]

const initialStockItems: StockItem[] = [
  {
    id: "stk-1",
    name: "Resina Composta Filtek Z350 XT (Cor A2)",
    category: "Restauradores",
    currentStock: 3,
    minStock: 5,
    unit: "Seringa 4g",
    expiryDate: "2027-10-30",
    supplier: "Dental Cremer",
    status: "alerta",
  },
  {
    id: "stk-2",
    name: "Anestésico Articaína 4% com Epinefrina 1:100.000",
    category: "Anestésicos",
    currentStock: 18,
    minStock: 10,
    unit: "Caixa 50 tubetes",
    expiryDate: "2026-12-15",
    supplier: "Surya Dental",
    status: "normal",
  },
  {
    id: "stk-3",
    name: "Luvas de Procedimento em Nitrilo (Tamanho M)",
    category: "Descartáveis",
    currentStock: 2,
    minStock: 10,
    unit: "Caixa 100 un",
    expiryDate: "2028-05-20",
    supplier: "Dental Speed",
    status: "critico",
  },
  {
    id: "stk-4",
    name: "Adesivo Dentário Single Bond Universal",
    category: "Restauradores",
    currentStock: 6,
    minStock: 3,
    unit: "Frasco 5ml",
    expiryDate: "2027-03-10",
    supplier: "Dental Cremer",
    status: "normal",
  },
  {
    id: "stk-5",
    name: "Cimento Resinoso RelyX U200",
    category: "Cimentos",
    currentStock: 4,
    minStock: 4,
    unit: "Seringa 8.5g",
    expiryDate: "2026-08-30",
    supplier: "Surya Dental",
    status: "alerta",
  },
]

const initialTeamMembers: TeamMember[] = [
  {
    id: "den-1",
    name: "Dra. Beatriz Silva",
    role: "dentista",
    registro: "CRO-SP 12345",
    phone: "(11) 98877-6655",
    email: "beatriz.silva@dentalis.com",
    specialty: "Odontologia Estética e Prótese",
    status: "ativo",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "den-2",
    name: "Dr. Rodrigo Martinez",
    role: "dentista",
    registro: "CRO-SP 54321",
    phone: "(11) 97766-5544",
    email: "rodrigo.martinez@dentalis.com",
    specialty: "Implantodontia e Cirurgia Oral",
    status: "ativo",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "den-3",
    name: "Dra. Camila Albuquerque",
    role: "dentista",
    registro: "CRO-SP 67890",
    phone: "(11) 96655-4433",
    email: "camila.albuquerque@dentalis.com",
    specialty: "Ortodontia e Odontopediatria",
    status: "ferias",
    avatar: "https://images.unsplash.com/photo-1594824813589-28956b6ab346?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "rec-1",
    name: "Ana Clara Souza",
    role: "recepcao",
    phone: "(11) 95544-3322",
    email: "recepcao@dentalis.com",
    status: "ativo",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "ast-1",
    name: "Marcos Vinícius Lima",
    role: "assistente",
    phone: "(11) 94433-2211",
    email: "marcos.asb@dentalis.com",
    status: "ativo",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  },
]

export const useDentalisStore = create<DentalisStore>((set) => ({
  patients: initialPatients,
  appointments: initialAppointments,
  transactions: initialTransactions,
  stockItems: initialStockItems,
  teamMembers: initialTeamMembers,
  selectedPatientId: "pat-1", // Começa com o Carlos Eduardo selecionado para a tela de pacientes já abrir rica

  fetchData: async () => {
    try {
      const [resPatients, resApts, resFinance, resStock, resTeam] = await Promise.all([
        fetch("/api/patients"),
        fetch("/api/appointments"),
        fetch("/api/finance"),
        fetch("/api/stock"),
        fetch("/api/team"),
      ])

      if (!resPatients.ok || !resApts.ok || !resFinance.ok || !resStock.ok || !resTeam.ok) {
        throw new Error("Resposta da API inválida.")
      }

      const patients = await resPatients.json()
      const appointments = await resApts.json()
      const transactions = await resFinance.json()
      const stockItems = await resStock.json()
      const teamMembers = await resTeam.json()

      set({
        patients,
        appointments,
        transactions,
        stockItems,
        teamMembers,
        selectedPatientId: patients[0]?.id || null,
      })
      console.log("Dados sincronizados com o PostgreSQL com sucesso.")
    } catch (err) {
      console.warn("API offline ou DATABASE_URL não configurada. Operando no modo em-memória offline com dados padrão.", err)
    }
  },

  setSelectedPatientId: (id) => set({ selectedPatientId: id }),

  addPatient: async (patient) => {
    const newPatient: Patient = {
      ...patient,
      id: `pat-${Date.now()}`,
      teeth: generateInitialTeeth(),
    }
    set((state) => ({ patients: [newPatient, ...state.patients] }))
    try {
      await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      })
    } catch (e) {
      console.error("Erro ao salvar paciente no banco de dados:", e)
    }
  },

  updatePatient: async (id, data) => {
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }))
    try {
      await fetch("/api/patients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      })
    } catch (e) {
      console.error("Erro ao atualizar paciente no banco de dados:", e)
    }
  },

  deletePatient: async (id) => {
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
      selectedPatientId: state.selectedPatientId === id ? null : state.selectedPatientId,
    }))
    try {
      await fetch(`/api/patients?id=${id}`, {
        method: "DELETE",
      })
    } catch (e) {
      console.error("Erro ao excluir paciente no banco de dados:", e)
    }
  },

  updateToothStatus: async (patientId, toothNumber, status, notes) => {
    let updatedPatient: Patient | null = null
    set((state) => {
      const updatedPatients = state.patients.map((p) => {
        if (p.id === patientId) {
          const currentTooth = p.teeth[toothNumber] || { id: toothNumber, number: toothNumber, status: "saudavel" }
          const newTeeth = {
            ...p.teeth,
            [toothNumber]: { ...currentTooth, status, notes: notes !== undefined ? notes : currentTooth.notes },
          }
          updatedPatient = { ...p, teeth: newTeeth }
          return updatedPatient
        }
        return p
      })
      return { patients: updatedPatients }
    })
    if (updatedPatient) {
      try {
        await fetch("/api/patients", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: patientId, teeth: (updatedPatient as Patient).teeth }),
        })
      } catch (e) {
        console.error("Erro ao atualizar odontograma no banco de dados:", e)
      }
    }
  },

  addAppointment: async (appointment) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
    }
    set((state) => ({ appointments: [...state.appointments, newAppointment] }))
    try {
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      })
    } catch (e) {
      console.error("Erro ao salvar agendamento no banco de dados:", e)
    }
  },

  updateAppointmentStatus: async (id, status) => {
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    }))
    try {
      await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
    } catch (e) {
      console.error("Erro ao atualizar status do agendamento no banco de dados:", e)
    }
  },

  deleteAppointment: async (id) => {
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    }))
    try {
      await fetch(`/api/appointments?id=${id}`, {
        method: "DELETE",
      })
    } catch (e) {
      console.error("Erro ao excluir agendamento no banco de dados:", e)
    }
  },

  addTransaction: async (transaction) => {
    const newTransaction: FinanceTransaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
    }
    set((state) => ({ transactions: [newTransaction, ...state.transactions] }))
    try {
      await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      })
    } catch (e) {
      console.error("Erro ao salvar transação no banco de dados:", e)
    }
  },

  updateTransactionStatus: async (id, status) => {
    const paymentDate = status === "pago" ? new Date().toISOString().split("T")[0] : undefined
    set((state) => ({
      transactions: state.transactions.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status,
            paymentDate: status === "pago" ? paymentDate : t.paymentDate,
          }
        }
        return t
      }),
    }))
    try {
      await fetch("/api/finance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, paymentDate }),
      })
    } catch (e) {
      console.error("Erro ao atualizar transação no banco de dados:", e)
    }
  },

  addStockItem: async (item) => {
    const newStockItem: StockItem = {
      ...item,
      id: `stk-${Date.now()}`,
    }
    set((state) => ({ stockItems: [...state.stockItems, newStockItem] }))
    try {
      await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStockItem),
      })
    } catch (e) {
      console.error("Erro ao salvar item no banco de dados:", e)
    }
  },

  updateStockItem: async (id, data) => {
    let updated: StockItem | null = null
    set((state) => {
      const updatedStock = state.stockItems.map((item) => {
        if (item.id === id) {
          const itemUpdated = { ...item, ...data }
          // Recalcula status baseado no estoque atual vs mínimo
          if (itemUpdated.currentStock <= 0 || itemUpdated.currentStock <= itemUpdated.minStock / 2) {
            itemUpdated.status = "critico"
          } else if (itemUpdated.currentStock <= itemUpdated.minStock) {
            itemUpdated.status = "alerta"
          } else {
            itemUpdated.status = "normal"
          }
          updated = itemUpdated
          return itemUpdated
        }
        return item
      })
      return { stockItems: updatedStock }
    })
    if (updated) {
      try {
        await fetch("/api/stock", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        })
      } catch (e) {
        console.error("Erro ao atualizar item de estoque no banco de dados:", e)
      }
    }
  },

  deleteStockItem: async (id) => {
    set((state) => ({
      stockItems: state.stockItems.filter((item) => item.id !== id),
    }))
    try {
      await fetch(`/api/stock?id=${id}`, {
        method: "DELETE",
      })
    } catch (e) {
      console.error("Erro ao excluir item de estoque no banco de dados:", e)
    }
  },

  addTeamMember: async (member) => {
    const newMember: TeamMember = {
      ...member,
      id: `mem-${Date.now()}`,
    }
    set((state) => ({ teamMembers: [...state.teamMembers, newMember] }))
    try {
      await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      })
    } catch (e) {
      console.error("Erro ao salvar colaborador no banco de dados:", e)
    }
  },

  updateTeamMember: async (id, data) => {
    let updated: TeamMember | null = null
    set((state) => {
      const updatedTeam = state.teamMembers.map((m) => {
        if (m.id === id) {
          updated = { ...m, ...data }
          return updated
        }
        return m
      })
      return { teamMembers: updatedTeam }
    })
    if (updated) {
      try {
        await fetch("/api/team", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        })
      } catch (e) {
        console.error("Erro ao atualizar colaborador no banco de dados:", e)
      }
    }
  },
}))
