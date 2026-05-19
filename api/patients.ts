import { initDatabase, pool } from "./_db.js"

export default async function handler(req: any, res: any) {
  // Configura CORS
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
      const { rows } = await pool.query("SELECT * FROM patients ORDER BY name ASC")
      // Mapear campos do banco para camelCase do React
      const patients = rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        cpf: r.cpf,
        phone: r.phone,
        email: r.email,
        birthDate: r.birth_date,
        gender: r.gender,
        covenio: r.covenio,
        status: r.status,
        avatar: r.avatar,
        anamnese: r.anamnese || {},
        teeth: r.teeth || {},
      }))
      res.status(200).json(patients)
      return
    }

    if (req.method === "POST") {
      const { id, name, cpf, phone, email, birthDate, gender, covenio, status, avatar, anamnese, teeth } = req.body
      await pool.query(
        "INSERT INTO patients (id, name, cpf, phone, email, birth_date, gender, covenio, status, avatar, anamnese, teeth) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
        [id, name, cpf, phone, email, birthDate, gender, covenio, status, avatar, JSON.stringify(anamnese || {}), JSON.stringify(teeth || {})]
      )
      res.status(201).json({ success: true, id })
      return
    }

    if (req.method === "PUT") {
      const { id, name, cpf, phone, email, birthDate, gender, covenio, status, avatar, anamnese, teeth } = req.body
      
      // Update individual fields dynamically if provided
      const updates: string[] = []
      const values: any[] = []
      let index = 1

      if (name !== undefined) { updates.push(`name = $${index++}`); values.push(name) }
      if (cpf !== undefined) { updates.push(`cpf = $${index++}`); values.push(cpf) }
      if (phone !== undefined) { updates.push(`phone = $${index++}`); values.push(phone) }
      if (email !== undefined) { updates.push(`email = $${index++}`); values.push(email) }
      if (birthDate !== undefined) { updates.push(`birth_date = $${index++}`); values.push(birthDate) }
      if (gender !== undefined) { updates.push(`gender = $${index++}`); values.push(gender) }
      if (covenio !== undefined) { updates.push(`covenio = $${index++}`); values.push(covenio) }
      if (status !== undefined) { updates.push(`status = $${index++}`); values.push(status) }
      if (avatar !== undefined) { updates.push(`avatar = $${index++}`); values.push(avatar) }
      if (anamnese !== undefined) { updates.push(`anamnese = $${index++}`); values.push(JSON.stringify(anamnese)) }
      if (teeth !== undefined) { updates.push(`teeth = $${index++}`); values.push(JSON.stringify(teeth)) }

      if (updates.length > 0) {
        values.push(id)
        await pool.query(
          `UPDATE patients SET ${updates.join(", ")} WHERE id = $${index}`,
          values
        )
      }
      res.status(200).json({ success: true })
      return
    }

    if (req.method === "DELETE") {
      const id = req.query.id || req.body.id
      if (!id) {
        res.status(400).json({ error: "Falta o ID do paciente" })
        return
      }
      await pool.query("DELETE FROM patients WHERE id = $1", [id])
      res.status(200).json({ success: true })
      return
    }

    res.status(405).json({ error: "Método não permitido" })
  } catch (error: any) {
    console.error("Erro no handler de patients:", error)
    res.status(500).json({ error: error.message })
  }
}
