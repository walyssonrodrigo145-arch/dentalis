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
      const { rows } = await pool.query("SELECT * FROM team_members ORDER BY name ASC")
      const members = rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        registro: r.registro || undefined,
        phone: r.phone,
        email: r.email,
        specialty: r.specialty || undefined,
        status: r.status,
        avatar: r.avatar,
      }))
      res.status(200).json(members)
      return
    }

    if (req.method === "POST") {
      const { id, name, role, registro, phone, email, specialty, status, avatar } = req.body
      await pool.query(
        "INSERT INTO team_members (id, name, role, registro, phone, email, specialty, status, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [id, name, role, registro || null, phone, email, specialty || null, status, avatar]
      )
      res.status(201).json({ success: true, id })
      return
    }

    if (req.method === "PUT") {
      const { id, name, role, registro, phone, email, specialty, status, avatar } = req.body
      
      const updates: string[] = []
      const values: any[] = []
      let index = 1

      if (name !== undefined) { updates.push(`name = $${index++}`); values.push(name) }
      if (role !== undefined) { updates.push(`role = $${index++}`); values.push(role) }
      if (registro !== undefined) { updates.push(`registro = $${index++}`); values.push(registro) }
      if (phone !== undefined) { updates.push(`phone = $${index++}`); values.push(phone) }
      if (email !== undefined) { updates.push(`email = $${index++}`); values.push(email) }
      if (specialty !== undefined) { updates.push(`specialty = $${index++}`); values.push(specialty) }
      if (status !== undefined) { updates.push(`status = $${index++}`); values.push(status) }
      if (avatar !== undefined) { updates.push(`avatar = $${index++}`); values.push(avatar) }

      if (updates.length > 0) {
        values.push(id)
        await pool.query(
          `UPDATE team_members SET ${updates.join(", ")} WHERE id = $${index}`,
          values
        )
      }
      res.status(200).json({ success: true })
      return
    }

    res.status(405).json({ error: "Método não permitido" })
  } catch (error: any) {
    console.error("Erro no handler de team:", error)
    res.status(500).json({ error: error.message })
  }
}
