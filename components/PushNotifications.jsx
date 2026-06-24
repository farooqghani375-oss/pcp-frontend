'use client'
import { useEffect } from 'react'

// Convert base64 VAPID public key to Uint8Array (required by browser)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}

export default function PushNotifications() {
  useEffect(() => {
    // Only run in browser, only if push is supported
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    async function setupPush() {
      try {
        // 1. Register the service worker
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('SW registered')

        // 2. Check if already subscribed
        const existingSubscription = await registration.pushManager.getSubscription()
        if (existingSubscription) return // already subscribed, nothing to do

        // 3. Ask user for permission
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return // user denied

        // 4. Fetch VAPID public key from backend
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/push/vapid-public-key`
        )
        const { publicKey } = await res.json()

        // 5. Subscribe to push
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        })

        // 6. Save subscription to backend
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        })

        console.log('Push subscription saved!')
      } catch (err) {
        console.error('Push setup failed:', err)
      }
    }

    // Small delay so it doesn't fire immediately on page load
    const timer = setTimeout(setupPush, 3000)
    return () => clearTimeout(timer)
  }, [])

  // This component renders nothing — it just runs the setup
  return null
}
