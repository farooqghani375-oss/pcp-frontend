import './globals.css'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Plant Center Peshawar',
  description: 'Your source for every plant, pot, and tool.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BottomNav />
          <WhatsAppFloat />
          <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
        </CartProvider>
      </body>
    </html>
  )
}