# 🚀 Portfolio Rchiy — Next.js v2

## ▶ Rodar local
```bash
npm install
npm run dev
# http://localhost:3000
```

## 🌐 Deploy na Vercel (domínio grátis)

### Passo 1 — Subir no GitHub
1. Crie conta em github.com
2. Crie repositório novo (ex: `portfolio`)
3. No terminal, dentro da pasta do projeto:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/portfolio.git
git push -u origin main
```

### Passo 2 — Deploy na Vercel
1. Acesse vercel.com e faça login com GitHub
2. Clique em "Add New Project"
3. Selecione o repositório `portfolio`
4. Clique em "Deploy" — pronto!

Você vai receber um domínio grátis tipo:
**https://portfolio-rchiy.vercel.app**

### Passo 3 — Domínio personalizado (opcional)
Para ter `rchiy.com.br` ou similar:
1. Compre o domínio em registro.br (domínio .com.br ~R$40/ano) ou namecheap.com
2. No painel da Vercel: Settings → Domains → Add
3. Adicione o domínio e siga as instruções de DNS

## 🔐 Acesso Admin
- URL: `/admin`
- Login: `Rchiy`
- Senha: `Miguel3223`

## 🔧 Personalizar
- `app/components/About.js` — seu texto e cidade
- `app/components/Contact.js` — e-mail, WhatsApp, GitHub, LinkedIn
- `app/components/Portfolio.js` — seus projetos reais
- `app/components/Pricing.js` — seus preços
- `app/globals.css` — cores (variável `--accent`)
