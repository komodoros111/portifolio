import './globals.css'

export const metadata = {
  title: 'Rchiy — Dev Full Stack',
  description: 'Desenvolvedor Full Stack — Sites, Apps Mobile, Desktop e Sistemas completos.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
