// public/sw.js — PCP Service Worker for Push Notifications

self.addEventListener('push', function (event) {
  if (!event.data) return

  const data = event.data.json()

  const options = {
    body: data.body,
    icon: data.icon || '/android-chrome-192x192.png',
    badge: data.badge || '/android-chrome-192x192.png',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// When user taps the notification — open the URL
self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If PCP is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          return
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
