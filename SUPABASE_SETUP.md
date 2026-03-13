# Supabase Setup — Rchiy Portfolio

## 1. Criar conta
Acesse https://supabase.com e crie uma conta grátis.

## 2. Criar projeto
- Clique em "New Project"
- Nome: rchiy-portfolio
- Salve a senha do banco

## 3. Pegar as chaves
Vá em Settings → API e copie:
- `Project URL` → NEXT_PUBLIC_SUPABASE_URL
- `anon public` key → NEXT_PUBLIC_SUPABASE_ANON_KEY

## 4. Criar as tabelas (SQL Editor → New Query)
Cole e execute esse SQL:

```sql
-- Orçamentos
create table orcamentos (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null,
  service text,
  idea text not null,
  budget text,
  deadline text,
  status text default 'pendente',
  resposta text,
  valor text,
  respondido_em timestamp,
  created_at timestamp default now()
);

-- Usuários clientes
create table clientes (
  id text primary key default gen_random_uuid()::text,
  nome text not null,
  login text unique not null,
  senha text not null,
  orcamento_id text references orcamentos(id),
  created_at timestamp default now()
);

-- Mensagens do chat
create table mensagens (
  id text primary key default gen_random_uuid()::text,
  orcamento_id text references orcamentos(id),
  remetente text not null, -- 'admin' ou 'cliente'
  texto text not null,
  created_at timestamp default now()
);

-- RLS policies (permitir acesso pela anon key)
alter table orcamentos enable row level security;
alter table clientes enable row level security;
alter table mensagens enable row level security;

create policy "allow_all_orcamentos" on orcamentos for all using (true) with check (true);
create policy "allow_all_clientes" on clientes for all using (true) with check (true);
create policy "allow_all_mensagens" on mensagens for all using (true) with check (true);
```

## 5. Variáveis de ambiente no Vercel
Vá em seu projeto no Vercel → Settings → Environment Variables e adicione:
- NEXT_PUBLIC_SUPABASE_URL = (sua URL)
- NEXT_PUBLIC_SUPABASE_ANON_KEY = (sua chave anon)

## 6. Redeploy
Após adicionar as variáveis, clique em Redeploy no Vercel.
