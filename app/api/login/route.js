import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'


export async function POST(req) {
  const { login, senha } = await req.json()

  // Admin login
  if (login === 'Rchiy' && senha === 'Miguel3223') {
    return NextResponse.json({ token: 'rchiy_admin_2024', user: 'Rchiy', role: 'admin' })
  }

  // Client login via Supabase
  try {
    const sb = supabase
    const { data: cliente, error } = await sb.from('clientes').select('*').eq('login', login).eq('senha', senha).single()
    if (error || !cliente) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }
    return NextResponse.json({
      token: `cliente_${cliente.id}`,
      user: cliente.nome,
      role: 'cliente',
      clienteId: cliente.id,
      clienteLogin: cliente.login,
      orcamentoId: cliente.orcamento_id,
    })
  } catch (e) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PATCH(req) {
  // Change password
  try {
    const sb = supabase
    const { login, senhaAtual, novaSenha } = await req.json()
    const { data: cliente } = await sb.from('clientes').select('*').eq('login', login).eq('senha', senhaAtual).single()
    if (!cliente) return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 401 })
    await sb.from('clientes').update({ senha: novaSenha }).eq('id', cliente.id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
