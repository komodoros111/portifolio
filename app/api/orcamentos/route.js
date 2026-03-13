import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'


function gerarSenha() {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function gerarLogin(nome) {
  const base = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'').slice(0,12)
  return base + Math.floor(Math.random() * 900 + 100)
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const clienteLogin = searchParams.get('cliente')

  if (token === 'rchiy_admin_2024') {
    const sb = supabase
    const { data, error } = await sb.from('orcamentos').select('*').order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (clienteLogin) {
    const sb = supabase
    const { data: cliente } = await sb.from('clientes').select('*, orcamentos(*)').eq('login', clienteLogin).single()
    if (!cliente) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    return NextResponse.json(cliente.orcamentos)
  }

  return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
}

export async function POST(req) {
  try {
    const sb = supabase
    const body = await req.json()
    const { name, email, service, idea, budget, deadline } = body
    if (!name || !email || !idea) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    // Insert orcamento
    const { data: orc, error: orcErr } = await sb.from('orcamentos').insert({
      name, email,
      service: service || 'Não informado',
      idea, budget: budget || '', deadline: deadline || '',
      status: 'pendente',
    }).select().single()

    if (orcErr) return NextResponse.json({ error: orcErr.message }, { status: 500 })

    // Generate client account
    const login = gerarLogin(name)
    const senha = gerarSenha()

    const { error: clienteErr } = await sb.from('clientes').insert({
      nome: name,
      login,
      senha,
      orcamento_id: orc.id,
    })

    if (clienteErr) return NextResponse.json({ error: clienteErr.message }, { status: 500 })

    return NextResponse.json({ ...orc, clienteLogin: login, clienteSenha: senha }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Erro interno: ' + e.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const sb = supabase
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    if (token !== 'rchiy_admin_2024') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    const body = await req.json()
    const { id, resposta, status, valor } = body
    const { data, error } = await sb.from('orcamentos').update({
      resposta, status, valor,
      respondido_em: new Date().toISOString(),
    }).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Erro interno: ' + e.message }, { status: 500 })
  }
}
