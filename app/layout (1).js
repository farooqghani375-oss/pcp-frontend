import './globals.css'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import Footer from '@/components/Footer'

// Change this to your real domain once you buy one.
const BASE_URL = 'https://pcp-frontend.vercel.app'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Plant Center Peshawar — Plants, Pots & Gardening Essentials',
    template: '%s | Plant Center Peshawar', // every page title becomes "Page Name | Plant Center Peshawar"
  },
  description: 'Peshawar\'s trusted plant store. Shop indoor plants, decorative pots, organic fertilizers, and gardening tools with fast local delivery across Peshawar.',
  keywords: ['plant center peshawar', 'plants peshawar', 'pots peshawar', 'gardening peshawar', 'indoor plants pakistan', 'buy plants online peshawar'],
  authors: [{ name: 'Plant Center Peshawar' }],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Plant Center Peshawar — Plants, Pots & Gardening Essentials',
    description: 'Peshawar\'s trusted plant store. Shop indoor plants, decorative pots, organic fertilizers, and gardening tools with fast local delivery.',
    url: BASE_URL,
    siteName: 'Plant Center Peshawar',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plant Center Peshawar',
    description: 'Peshawar\'s trusted plant store — plants, pots, and gardening essentials.',
  },
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
