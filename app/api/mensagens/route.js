import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'


export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const orcamento_id = searchParams.get('orcamento_id')
  if (!orcamento_id) return NextResponse.json([])
  const sb = supabase
  const { data, error } = await sb.from('mensagens').select('*').eq('orcamento_id', orcamento_id).order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req) {
  try {
    const sb = supabase
    const { orcamento_id, remetente, texto } = await req.json()
    if (!orcamento_id || !remetente || !texto?.trim()) {
      return NextResponse.json({ error: 'Campos faltando' }, { status: 400 })
    }
    const { data, error } = await sb.from('mensagens').insert({ orcamento_id, remetente, texto: texto.trim() }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
