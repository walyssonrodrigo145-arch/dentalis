import { initDatabase, pool } from "./_db.js"

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  try {
    await initDatabase()
  } catch (err) {
    console.error("Falha ao inicializar o banco:", err)
  }

  try {
    if (req.method === "GET") {
      const { rows } = await pool.query("SELECT * FROM finance_transactions ORDER BY due_date DESC")
      const transactions = rows.map((r: any) => ({
        id: r.id,
        patientId: r.patient_id || undefined,
        patientName: r.patient_name || undefined,
        description: r.description,
        amount: parseFloat(r.amount),
        dueDate: r.due_date,
        paymentDate: r.payment_date || undefined,
        status: r.status,
        method: r.method,
        type: r.type,
        category: r.category,
      }))
      res.status(200).json(transactions)
      return
    }

    if (req.method === "POST") {
      const { id, patientId, patientName, description, amount, dueDate, paymentDate, status, method, type, category } = req.body
      await pool.query(
        "INSERT INTO finance_transactions (id, patient_id, patient_name, description, amount, due_date, payment_date, status, method, type, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [id, patientId || null, patientName || null, description, amount, dueDate, paymentDate || null, status, method, type, category]
      )
      res.status(201).json({ success: true, id })
      return
    }

    if (req.method === "PUT") {
      const { id, status, paymentDate } = req.body
      await pool.query(
        "UPDATE finance_transactions SET status = $1, payment_date = $2 WHERE id = $3",
        [status, paymentDate || null, id]
      )
      res.status(200).json({ success: true })
      return
    }

    res.status(405).json({ error: "Método não permitido" })
  } catch (error: any) {
    console.error("Erro no handler de finance:", error)
    res.status(500).json({ error: error.message })
  }
}
