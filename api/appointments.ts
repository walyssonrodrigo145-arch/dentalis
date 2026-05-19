import { initDatabase, pool } from "./_db"

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
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
      const { rows } = await pool.query("SELECT * FROM appointments ORDER BY date ASC, time ASC")
      const appointments = rows.map((r: any) => ({
        id: r.id,
        patientId: r.patient_id,
        patientName: r.patient_name,
        dentistId: r.dentist_id,
        dentistName: r.dentist_name,
        date: r.date,
        time: r.time,
        duration: r.duration,
        status: r.status,
        procedure: r.procedure,
        notes: r.notes || "",
      }))
      res.status(200).json(appointments)
      return
    }

    if (req.method === "POST") {
      const { id, patientId, patientName, dentistId, dentistName, date, time, duration, status, procedure, notes } = req.body
      await pool.query(
        "INSERT INTO appointments (id, patient_id, patient_name, dentist_id, dentist_name, date, time, duration, status, procedure, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [id, patientId, patientName, dentistId, dentistName, date, time, duration, status, procedure, notes || ""]
      )
      res.status(201).json({ success: true, id })
      return
    }

    if (req.method === "PUT") {
      const { id, status, notes, date, time, duration } = req.body
      
      const updates: string[] = []
      const values: any[] = []
      let index = 1

      if (status !== undefined) { updates.push(`status = $${index++}`); values.push(status) }
      if (notes !== undefined) { updates.push(`notes = $${index++}`); values.push(notes) }
      if (date !== undefined) { updates.push(`date = $${index++}`); values.push(date) }
      if (time !== undefined) { updates.push(`time = $${index++}`); values.push(time) }
      if (duration !== undefined) { updates.push(`duration = $${index++}`); values.push(duration) }

      if (updates.length > 0) {
        values.push(id)
        await pool.query(
          `UPDATE appointments SET ${updates.join(", ")} WHERE id = $${index}`,
          values
        )
      }
      res.status(200).json({ success: true })
      return
    }

    if (req.method === "DELETE") {
      const id = req.query.id || req.body.id
      if (!id) {
        res.status(400).json({ error: "Falta o ID do agendamento" })
        return
      }
      await pool.query("DELETE FROM appointments WHERE id = $1", [id])
      res.status(200).json({ success: true })
      return
    }

    res.status(405).json({ error: "Método não permitido" })
  } catch (error: any) {
    console.error("Erro no handler de appointments:", error)
    res.status(500).json({ error: error.message })
  }
}
