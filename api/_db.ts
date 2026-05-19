import pg from "pg"
const { Pool } = pg

const connectionString = process.env.DATABASE_URL

export const pool = new Pool({
  connectionString,
  ssl: connectionString ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

let dbInitialized = false

// Helper para gerar dentes iniciais (11-18, 21-28, 31-38, 41-48)
const generateInitialTeeth = () => {
  const teeth: any = {}
  const quadrants = [1, 2, 3, 4]
  quadrants.forEach((q) => {
    for (let i = 1; i <= 8; i++) {
      const num = q * 10 + i
      teeth[num] = { id: num, number: num, status: "saudavel" }
    }
  })
  return teeth
}

export async function initDatabase() {
  if (dbInitialized) return
  if (!connectionString) {
    console.warn("DATABASE_URL não configurada. Operando no modo sem banco de dados.")
    return
  }

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // 1. Criar tabela de pacientes
    await client.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cpf VARCHAR(50),
        phone VARCHAR(50),
        email VARCHAR(255),
        birth_date VARCHAR(50),
        gender VARCHAR(50),
        covenio VARCHAR(100),
        status VARCHAR(50),
        avatar VARCHAR(500),
        anamnese JSONB,
        teeth JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // 2. Criar tabela de consultas
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(100) PRIMARY KEY,
        patient_id VARCHAR(100) NOT NULL,
        patient_name VARCHAR(255) NOT NULL,
        dentist_id VARCHAR(100) NOT NULL,
        dentist_name VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        time VARCHAR(50) NOT NULL,
        duration INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        procedure VARCHAR(255) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // 3. Criar tabela de transações financeiras
    await client.query(`
      CREATE TABLE IF NOT EXISTS finance_transactions (
        id VARCHAR(100) PRIMARY KEY,
        patient_id VARCHAR(100),
        patient_name VARCHAR(255),
        description VARCHAR(255) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        due_date VARCHAR(50) NOT NULL,
        payment_date VARCHAR(50),
        status VARCHAR(50) NOT NULL,
        method VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // 4. Criar tabela de estoque
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock_items (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        current_stock INTEGER NOT NULL,
        min_stock INTEGER NOT NULL,
        unit VARCHAR(50) NOT NULL,
        expiry_date VARCHAR(50) NOT NULL,
        supplier VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // 5. Criar tabela de equipe
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        registro VARCHAR(100),
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        specialty VARCHAR(255),
        status VARCHAR(50) NOT NULL,
        avatar VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Check if table needs seeding
    const { rows } = await client.query("SELECT COUNT(*) FROM patients")
    const count = parseInt(rows[0].count, 10)

    if (count === 0) {
      console.log("Seeding inicial dos dados no PostgreSQL...")

      // Seed Patients
      const initialPatients = [
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

      for (const p of initialPatients) {
        await client.query(
          "INSERT INTO patients (id, name, cpf, phone, email, birth_date, gender, covenio, status, avatar, anamnese, teeth) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
          [p.id, p.name, p.cpf, p.phone, p.email, p.birthDate, p.gender, p.covenio, p.status, p.avatar, JSON.stringify(p.anamnese), JSON.stringify(p.teeth)]
        )
      }

      // Seed Appointments
      const initialAppointments = [
        {
          id: "apt-1",
          patientId: "pat-1",
          patientName: "Carlos Eduardo Santos",
          dentistId: "den-1",
          dentistName: "Dra. Beatriz Silva",
          date: new Date().toISOString().split("T")[0],
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
          date: new Date().toISOString().split("T")[0],
          time: "16:00",
          duration: 45,
          status: "em_atendimento",
          procedure: "Sessão 1: Clareamento a Laser + Profilaxia",
          notes: "Registrar cor inicial da escala Vita.",
        },
      ]

      for (const a of initialAppointments) {
        await client.query(
          "INSERT INTO appointments (id, patient_id, patient_name, dentist_id, dentist_name, date, time, duration, status, procedure, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
          [a.id, a.patientId, a.patientName, a.dentistId, a.dentistName, a.date, a.time, a.duration, a.status, a.procedure, a.notes]
        )
      }

      // Seed Transactions
      const initialTransactions = [
        {
          id: "tx-1",
          patientId: "pat-1",
          patientName: "Carlos Eduardo Santos",
          description: "Restauração Resina Oclusal (Dente 46)",
          amount: 280.0,
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
          description: "Sessão Clareamento Dental Opcional",
          amount: 600.0,
          dueDate: new Date().toISOString().split("T")[0],
          paymentDate: undefined,
          status: "pendente",
          method: "cartao",
          type: "receita",
          category: "Estética",
        },
        {
          id: "tx-3",
          description: "Fornecedor Dental Cremer (Resinas/Luvas)",
          amount: 450.0,
          dueDate: new Date().toISOString().split("T")[0],
          paymentDate: new Date().toISOString().split("T")[0],
          status: "pago",
          method: "boleto",
          type: "despesa",
          category: "Fornecedores e Materiais",
        },
      ]

      for (const t of initialTransactions) {
        await client.query(
          "INSERT INTO finance_transactions (id, patient_id, patient_name, description, amount, due_date, payment_date, status, method, type, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
          [t.id, t.patientId || null, t.patientName || null, t.description, t.amount, t.dueDate, t.paymentDate || null, t.status, t.method, t.type, t.category]
        )
      }

      // Seed Stock Items
      const initialStock = [
        { id: "st-1", name: "Resina Filtek Z250 A2 4g", category: "Restauradores", currentStock: 8, minStock: 3, unit: "Seringa", expiryDate: "2027-04-18", supplier: "Dental Cremer", status: "normal" },
        { id: "st-2", name: "Anestésico Mepiadre 2% (Mepivacaína)", category: "Anestésicos", currentStock: 1, minStock: 2, unit: "Caixa c/ 50 tubetes", expiryDate: "2026-11-30", supplier: "Dental Cremer", status: "critico" },
        { id: "st-3", name: "Luva Látex Supermax Tam M", category: "Descartáveis", currentStock: 4, minStock: 5, unit: "Caixa c/ 100 un", expiryDate: "2028-02-15", supplier: "Dental Speed", status: "alerta" },
      ]

      for (const s of initialStock) {
        await client.query(
          "INSERT INTO stock_items (id, name, category, current_stock, min_stock, unit, expiry_date, supplier, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
          [s.id, s.name, s.category, s.currentStock, s.minStock, s.unit, s.expiryDate, s.supplier, s.status]
        )
      }

      // Seed Team Members
      const initialTeam = [
        { id: "den-1", name: "Dra. Beatriz Silva", role: "dentista", registro: "CRO-SP 98765", phone: "(11) 99988-7766", email: "beatriz.silva@dentalis.com", specialty: "Ortodontia & Estética", status: "ativo", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150" },
        { id: "den-2", name: "Dr. Carlos Alberto", role: "dentista", registro: "CRO-SP 12345", phone: "(11) 98877-6655", email: "carlos.alberto@dentalis.com", specialty: "Implantodontia & Cirurgia", status: "ativo", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150" },
        { id: "col-1", name: "Renata Mendes", role: "recepcao", phone: "(11) 97766-5544", email: "renata.mendes@dentalis.com", status: "ativo", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" },
      ]

      for (const m of initialTeam) {
        await client.query(
          "INSERT INTO team_members (id, name, role, registro, phone, email, specialty, status, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
          [m.id, m.name, m.role, m.registro || null, m.phone, m.email, m.specialty || null, m.status, m.avatar]
        )
      }
    }

    await client.query("COMMIT")
    dbInitialized = true
    console.log("Banco de dados pronto e inicializado.")
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Erro na inicialização do banco de dados:", error)
  } finally {
    client.release()
  }
}
