import './globals.css'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'
import WakeUpBackend from '@/components/WakeUpBackend'

const BASE_URL = 'https://pcp-frontend.vercel.app'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Plant Center Peshawar — Plants, Pots & Gardening Essentials',
    template: '%s | Plant Center Peshawar',
  },
  description: 'Peshawar\'s trusted plant store. Shop indoor plants, decorative pots, organic fertilizers, and gardening tools with fast local delivery across Peshawar.',
  keywords: ['plant center peshawar', 'plants peshawar', 'pots peshawar', 'gardening peshawar', 'indoor plants pakistan', 'buy plants online peshawar'],
  authors: [{ name: 'Plant Center Peshawar' }],
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
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PWA */}
        <meta name="theme-color" content="#166534" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PCP" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BottomNav />
          <WhatsAppFloat />
          <ChatWidget />
          <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
          <WakeUpBackend />
        </CartProvider>
      </body>
    </html>
  )
}
