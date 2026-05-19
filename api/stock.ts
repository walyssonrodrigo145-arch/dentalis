import { initDatabase, pool } from "./_db.js"

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
      const { rows } = await pool.query("SELECT * FROM stock_items ORDER BY name ASC")
      const items = rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        currentStock: r.current_stock,
        minStock: r.min_stock,
        unit: r.unit,
        expiryDate: r.expiry_date,
        supplier: r.supplier,
        status: r.status,
      }))
      res.status(200).json(items)
      return
    }

    if (req.method === "POST") {
      const { id, name, category, currentStock, minStock, unit, expiryDate, supplier, status } = req.body
      await pool.query(
        "INSERT INTO stock_items (id, name, category, current_stock, min_stock, unit, expiry_date, supplier, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [id, name, category, currentStock, minStock, unit, expiryDate, supplier, status]
      )
      res.status(201).json({ success: true, id })
      return
    }

    if (req.method === "PUT") {
      const { id, name, category, currentStock, minStock, unit, expiryDate, supplier, status } = req.body
      
      const updates: string[] = []
      const values: any[] = []
      let index = 1

      if (name !== undefined) { updates.push(`name = $${index++}`); values.push(name) }
      if (category !== undefined) { updates.push(`category = $${index++}`); values.push(category) }
      if (currentStock !== undefined) { updates.push(`current_stock = $${index++}`); values.push(currentStock) }
      if (minStock !== undefined) { updates.push(`min_stock = $${index++}`); values.push(minStock) }
      if (unit !== undefined) { updates.push(`unit = $${index++}`); values.push(unit) }
      if (expiryDate !== undefined) { updates.push(`expiry_date = $${index++}`); values.push(expiryDate) }
      if (supplier !== undefined) { updates.push(`supplier = $${index++}`); values.push(supplier) }
      if (status !== undefined) { updates.push(`status = $${index++}`); values.push(status) }

      if (updates.length > 0) {
        values.push(id)
        await pool.query(
          `UPDATE stock_items SET ${updates.join(", ")} WHERE id = $${index}`,
          values
        )
      }
      res.status(200).json({ success: true })
      return
    }

    if (req.method === "DELETE") {
      const id = req.query.id || req.body.id
      if (!id) {
        res.status(400).json({ error: "Falta o ID do item de estoque" })
        return
      }
      await pool.query("DELETE FROM stock_items WHERE id = $1", [id])
      res.status(200).json({ success: true })
      return
    }

    res.status(405).json({ error: "Método não permitido" })
  } catch (error: any) {
    console.error("Erro no handler de stock:", error)
    res.status(500).json({ error: error.message })
  }
}
