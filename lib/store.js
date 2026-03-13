// Simple JSON file-based store for budget requests
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'lib', 'db.json')

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ orcamentos: [] }))
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
  } catch {
    return { orcamentos: [] }
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

export function getAllOrcamentos() {
  return readDB().orcamentos
}

export function addOrcamento(data) {
  const db = readDB()
  const novo = {
    id: Date.now().toString(),
    ...data,
    status: 'pendente',
    resposta: null,
    createdAt: new Date().toISOString(),
  }
  db.orcamentos.unshift(novo)
  writeDB(db)
  return novo
}

export function updateOrcamento(id, updates) {
  const db = readDB()
  const idx = db.orcamentos.findIndex(o => o.id === id)
  if (idx === -1) return null
  db.orcamentos[idx] = { ...db.orcamentos[idx], ...updates }
  writeDB(db)
  return db.orcamentos[idx]
}
