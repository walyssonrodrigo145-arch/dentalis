import { create } from "zustand"

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  birthDate: string
  avatar: string
  status: "Ativo" | "Inativo" | "Em Tratamento"
  convenio: string
  anamnese: {
    alergias: string
    medicamentos: string
    doencasBase: string
    observacoes: string
  }
  odontograma: Record<string, string> // ex: { "11": "Cárie", "26": "Restaurado" }
  timeline: Array<{
    id: string
    date: string
    title: string
    description: string
    type: "consulta" | "procedimento" | "exame" | "financeiro"
  }>
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  dentistId: string
  dentistName: string
  date: string
  time: string
  duration: number // minutos
  type: string
  status: "Confirmado" | "Aguardando" | "Em Atendimento" | "Finalizado" | "Falta"
  notes?: string
}

export interface Transaction {
  id: string
  patientName: string
  description: string
  amount: number
  type: "receita" | "despesa"
  category: string
  date: string
  status: "Pago" | "Pendente" | "Atrasado"
  paymentMethod: "Pix" | "Cartão de Crédito" | "Boleto" | "Transferência"
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  minQuantity: number
  unit: string
  expirationDate: string
  supplier: string
  cost: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  cro?: string
  avatar: string
  email: string
  phone: string
  commissionRate: number
  monthlyGoal: number
  currentProgress: number
  permissions: "Admin" | "Dentista" | "Recepção"
}

interface DentalisStore {
  // Pacientes
  patients: Patient[]
  addPatient: (patient: Omit<Patient, "id">) => void
  updatePatient: (id: string, data: Partial<Patient>) => void
  deletePatient: (id: string) => void
  updateOdontograma: (patientId: string, toothId: string, status: string) => void

  // Agenda
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, "id">) => void
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void

  // Financeiro
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  updateTransactionStatus: (id: string, status: Transaction["status"]) => void

  // Estoque
  inventory: InventoryItem[]
  addInventoryItem: (item: Omit<InventoryItem, "id">) => void
  updateInventoryQuantity: (id: string, quantity: number) => void

  // Equipe
  team: TeamMember[]
}

const initialPatients: Patient[] = [
  {
    id: "1",
    name: "Carlos Eduardo Santos",
    email: "carlos.santos@email.com",
    phone: "11987654321",
    cpf: "12345678900",
    birthDate: "1985-06-15",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    status: "Em Tratamento",
    convenio: "Bradesco Saúde",
    anamnese: {
      alergias: "Penicilina, Dipirona",
      medicamentos: "Losartana 50mg",
      doencasBase: "Hipertensão controlada",
      observacoes: "Paciente com ansiedade odontológica, prefere atendimento no período da manhã.",
    },
    odontograma: {
      "16": "Restaurado",
      "26": "Cárie",
      "36": "Canal",
      "46": "Coroa",
    },
    timeline: [
      { id: "t1", date: "2026-05-18T10:30:00", title: "Consulta Inicial", description: "Avaliação geral e planejamento de raspagem.", type: "consulta" },
      { id: "t2", date: "2026-05-18T11:15:00", title: "Radiografia Panorâmica", description: "Upload de exame panorâmico realizado na clínica externa.", type: "exame" },
      { id: "t3", date: "2026-05-18T11:30:00", title: "Pagamento de Orçamento", description: "Entrada de R$ 850,00 via Pix referente à primeira fase.", type: "financeiro" },
    ],
  },
  {
    id: "2",
    name: "Mariana Oliveira Costa",
    email: "mariana.costa@email.com",
    phone: "11976543210",
    cpf: "98765432100",
    birthDate: "1992-03-22",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    status: "Ativo",
    convenio: "SulAmérica",
    anamnese: {
      alergias: "Nenhuma",
      medicamentos: "Nenhum",
      doencasBase: "Nenhuma",
      observacoes: "Tratamento ortodôntico contínuo (Alinhadores invisíveis).",
    },
    odontograma: {
      "11": "Hígido",
      "12": "Hígido",
      "21": "Hígido",
      "22": "Hígido",
    },
    timeline: [
      { id: "t4", date: "2026-05-10T15:00:00", title: "Manutenção de Alinhador", description: "Troca para o conjunto #12. Excelente adaptação.", type: "procedimento" },
    ],
  },
  {
    id: "3",
    name: "Roberto Almeida Souza",
    email: "roberto.souza@email.com",
    phone: "11965432109",
    cpf: "45678912300",
    birthDate: "1978-11-05",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    status: "Inativo",
    convenio: "Particular",
    anamnese: {
      alergias: "Iodo",
      medicamentos: "Glifage",
      doencasBase: "Diabetes Tipo 2",
      observacoes: "Paciente necessita de profilaxia antibiótica antes de procedimentos invasivos.",
    },
    odontograma: {
      "18": "Ausente",
      "28": "Ausente",
      "38": "Ausente",
      "48": "Ausente",
    },
    timeline: [
      { id: "t5", date: "2025-11-20T14:00:00", title: "Limpeza Semestral", description: "Profilaxia e aplicação de flúor.", type: "procedimento" },
    ],
  },
]

const initialAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Carlos Eduardo Santos",
    dentistId: "d1",
    dentistName: "Dra. Beatriz Silva",
    date: "2026-05-19",
    time: "14:30",
    duration: 60,
    type: "Restauração",
    status: "Confirmado",
    notes: "Restauração do dente 26 (Cárie profunda).",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Mariana Oliveira Costa",
    dentistId: "d1",
    dentistName: "Dra. Beatriz Silva",
    date: "2026-05-19",
    time: "15:30",
    duration: 30,
    type: "Manutenção Ortodôntica",
    status: "Aguardando",
    notes: "Entrega do par de alinhadores #13.",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Roberto Almeida Souza",
    dentistId: "d2",
    dentistName: "Dr. Rodrigo Mendes",
    date: "2026-05-19",
    time: "16:30",
    duration: 45,
    type: "Avaliação de Implante",
    status: "Em Atendimento",
    notes: "Análise de tomografia para implante no elemento 36.",
  },
  {
    id: "4",
    patientId: "1",
    patientName: "Carlos Eduardo Santos",
    dentistId: "d1",
    dentistName: "Dra. Beatriz Silva",
    date: "2026-05-20",
    time: "10:00",
    duration: 60,
    type: "Tratamento de Canal",
    status: "Confirmado",
  },
]

const initialTransactions: Transaction[] = [
  {
    id: "1",
    patientName: "Carlos Eduardo Santos",
    description: "Tratamento de Canal - Dente 36 (1ª Parcela)",
    amount: 850,
    type: "receita",
    category: "Procedimentos",
    date: "2026-05-18",
    status: "Pago",
    paymentMethod: "Pix",
  },
  {
    id: "2",
    patientName: "Mariana Oliveira Costa",
    description: "Manutenção Alinhadores Invisíveis",
    amount: 450,
    type: "receita",
    category: "Ortodontia",
    date: "2026-05-19",
    status: "Pago",
    paymentMethod: "Cartão de Crédito",
  },
  {
    id: "3",
    patientName: "Dental Cremer Ltda",
    description: "Compra de Resinas e Luvas",
    amount: 1420.5,
    type: "despesa",
    category: "Fornecedores",
    date: "2026-05-15",
    status: "Pago",
    paymentMethod: "Boleto",
  },
  {
    id: "4",
    patientName: "Roberto Almeida Souza",
    description: "Clareamento Dental a Laser",
    amount: 1200,
    type: "receita",
    category: "Estética",
    date: "2026-05-20",
    status: "Pendente",
    paymentMethod: "Boleto",
  },
  {
    id: "5",
    patientName: "Enel Distribuição",
    description: "Conta de Energia Elétrica",
    amount: 580.2,
    type: "despesa",
    category: "Infraestrutura",
    date: "2026-05-10",
    status: "Pago",
    paymentMethod: "Transferência",
  },
]

const initialInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Resina Composta Filtek Z350 (A2)",
    category: "Dentística",
    quantity: 3,
    minQuantity: 5,
    unit: "Seringa 4g",
    expirationDate: "2027-10-12",
    supplier: "Dental Cremer",
    cost: 189.9,
  },
  {
    id: "2",
    name: "Anestésico Articaína 4% com Epinefrina",
    category: "Anestésicos",
    quantity: 18,
    minQuantity: 10,
    unit: "Caixa 50 tubetes",
    expirationDate: "2026-12-30",
    supplier: "Dental Speed",
    cost: 145.0,
  },
  {
    id: "3",
    name: "Luva de Procedimento Nitrílica (M)",
    category: "Descartáveis",
    quantity: 2,
    minQuantity: 10,
    unit: "Caixa 100 un",
    expirationDate: "2028-05-20",
    supplier: "Surya Dental",
    cost: 49.9,
  },
  {
    id: "4",
    name: "Broca Diamantada 1014 (Alta Rotação)",
    category: "Rotatórios",
    quantity: 15,
    minQuantity: 5,
    unit: "Unidade",
    expirationDate: "2030-01-01",
    supplier: "Dental Cremer",
    cost: 12.5,
  },
  {
    id: "5",
    name: "Cimento Sulfato de Cálcio (Coltosol)",
    category: "Endodontia",
    quantity: 4,
    minQuantity: 3,
    unit: "Pote 20g",
    expirationDate: "2026-08-15",
    supplier: "Dental Speed",
    cost: 35.0,
  },
]

const initialTeam: TeamMember[] = [
  {
    id: "d1",
    name: "Dra. Beatriz Silva",
    role: "Cirurgiã-Dentista / Sócia",
    cro: "CRO-SP 48291",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100",
    email: "beatriz.silva@dentalis.com",
    phone: "11999887766",
    commissionRate: 40,
    monthlyGoal: 45000,
    currentProgress: 38250,
    permissions: "Admin",
  },
  {
    id: "d2",
    name: "Dr. Rodrigo Mendes",
    role: "Implantodontista",
    cro: "CRO-SP 59201",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100",
    email: "rodrigo.mendes@dentalis.com",
    phone: "11988776655",
    commissionRate: 50,
    monthlyGoal: 60000,
    currentProgress: 42000,
    permissions: "Dentista",
  },
  {
    id: "r1",
    name: "Ana Clara Souza",
    role: "Gerente de Recepção",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    email: "recepcao@dentalis.com",
    phone: "11977665544",
    commissionRate: 5,
    monthlyGoal: 10000,
    currentProgress: 8500,
    permissions: "Recepção",
  },
]

export const useDentalisStore = create<DentalisStore>((set) => ({
  patients: initialPatients,
  addPatient: (patient) =>
    set((state) => ({
      patients: [
        ...state.patients,
        {
          ...patient,
          id: String(state.patients.length + 1),
          odontograma: patient.odontograma || {},
          timeline: [
            {
              id: `t_${Date.now()}`,
              date: new Date().toISOString(),
              title: "Cadastro de Paciente",
              description: "Paciente cadastrado no sistema Dentalis Premium.",
              type: "consulta",
            },
          ],
        },
      ],
    })),
  updatePatient: (id, data) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deletePatient: (id) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
    })),
  updateOdontograma: (patientId, toothId, status) =>
    set((state) => ({
      patients: state.patients.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            odontograma: {
              ...p.odontograma,
              [toothId]: status,
            },
            timeline: [
              {
                id: `t_${Date.now()}`,
                date: new Date().toISOString(),
                title: `Atualização Odontograma (Dente ${toothId})`,
                description: `Status alterado para: ${status}.`,
                type: "procedimento",
              },
              ...p.timeline,
            ],
          }
        }
        return p
      }),
    })),

  appointments: initialAppointments,
  addAppointment: (app) =>
    set((state) => ({
      appointments: [...state.appointments, { ...app, id: String(state.appointments.length + 1) }],
    })),
  updateAppointmentStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    })),

  transactions: initialTransactions,
  addTransaction: (tx) =>
    set((state) => ({
      transactions: [...state.transactions, { ...tx, id: String(state.transactions.length + 1) }],
    })),
  updateTransactionStatus: (id, status) =>
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  inventory: initialInventory,
  addInventoryItem: (item) =>
    set((state) => ({
      inventory: [...state.inventory, { ...item, id: String(state.inventory.length + 1) }],
    })),
  updateInventoryQuantity: (id, quantity) =>
    set((state) => ({
      inventory: state.inventory.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),

  team: initialTeam,
}))
