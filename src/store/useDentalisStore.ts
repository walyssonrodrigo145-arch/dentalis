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
  setSelectedPatientId: (id: string | null) => void
  addPatient: (patient: Omit<Patient, "id" | "teeth">) => void
  updatePatient: (id: string, data: Partial<Patient>) => void
  deletePatient: (id: string) => void
  updateToothStatus: (patientId: string, toothNumber: number, status: ToothState["status"], notes?: string) => void

  addAppointment: (appointment: Omit<Appointment, "id">) => void
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void
  deleteAppointment: (id: string) => void

  addTransaction: (transaction: Omit<FinanceTransaction, "id">) => void
  updateTransactionStatus: (id: string, status: FinanceTransaction["status"]) => void

  addStockItem: (item: Omit<StockItem, "id">) => void
  updateStockItem: (id: string, data: Partial<StockItem>) => void
  deleteStockItem: (id: string) => void

  addTeamMember: (member: Omit<TeamMember, "id">) => void
  updateTeamMember: (id: string, data: Partial<TeamMember>) => void
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

  setSelectedPatientId: (id) => set({ selectedPatientId: id }),

  addPatient: (patient) =>
    set((state) => {
      const newPatient: Patient = {
        ...patient,
        id: `pat-${Date.now()}`,
        teeth: generateInitialTeeth(),
      }
      return { patients: [newPatient, ...state.patients] }
    }),

  updatePatient: (id, data) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),

  deletePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
      selectedPatientId: state.selectedPatientId === id ? null : state.selectedPatientId,
    })),

  updateToothStatus: (patientId, toothNumber, status, notes) =>
    set((state) => ({
      patients: state.patients.map((p) => {
        if (p.id === patientId) {
          const currentTooth = p.teeth[toothNumber] || { id: toothNumber, number: toothNumber, status: "saudavel" }
          return {
            ...p,
            teeth: {
              ...p.teeth,
              [toothNumber]: { ...currentTooth, status, notes: notes !== undefined ? notes : currentTooth.notes },
            },
          }
        }
        return p
      }),
    })),

  addAppointment: (appointment) =>
    set((state) => {
      const newAppointment: Appointment = {
        ...appointment,
        id: `apt-${Date.now()}`,
      }
      return { appointments: [...state.appointments, newAppointment] }
    }),

  updateAppointmentStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    })),

  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    })),

  addTransaction: (transaction) =>
    set((state) => {
      const newTransaction: FinanceTransaction = {
        ...transaction,
        id: `tx-${Date.now()}`,
      }
      return { transactions: [newTransaction, ...state.transactions] }
    }),

  updateTransactionStatus: (id, status) =>
    set((state) => ({
      transactions: state.transactions.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status,
            paymentDate: status === "pago" ? new Date().toISOString().split("T")[0] : t.paymentDate,
          }
        }
        return t
      }),
    })),

  addStockItem: (item) =>
    set((state) => {
      const newStockItem: StockItem = {
        ...item,
        id: `stk-${Date.now()}`,
      }
      return { stockItems: [...state.stockItems, newStockItem] }
    }),

  updateStockItem: (id, data) =>
    set((state) => ({
      stockItems: state.stockItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...data }
          // Recalcula status baseado no estoque atual vs mínimo
          if (updated.currentStock <= 0 || updated.currentStock <= updated.minStock / 2) {
            updated.status = "critico"
          } else if (updated.currentStock <= updated.minStock) {
            updated.status = "alerta"
          } else {
            updated.status = "normal"
          }
          return updated
        }
        return item
      }),
    })),

  deleteStockItem: (id) =>
    set((state) => ({
      stockItems: state.stockItems.filter((item) => item.id !== id),
    })),

  addTeamMember: (member) =>
    set((state) => {
      const newMember: TeamMember = {
        ...member,
        id: `mem-${Date.now()}`,
      }
      return { teamMembers: [...state.teamMembers, newMember] }
    }),

  updateTeamMember: (id, data) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((m) => (m.id === id ? { ...m, ...data } : m)),
    })),
}))
