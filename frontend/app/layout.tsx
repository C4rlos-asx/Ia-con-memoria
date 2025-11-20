import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AION Media Developers - IA con Memoria',
  description: 'Plataforma de IA con memoria usando Gemini, PostgreSQL y Redis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
