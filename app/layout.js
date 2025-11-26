import './globals.css'

export const metadata = {
  title: 'Lokr Vault - Secure Asset Management',
  description: 'Enterprise-grade vault system on Arc Network',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
