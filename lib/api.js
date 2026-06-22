const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function getProducts() {
  const res = await fetch(`${BASE}/products`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getProduct(slug) {
  const res = await fetch(`${BASE}/products/slug/${slug}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Product not found')
  return res.json()
}

export async function placeOrder(orderData) {
  const res = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  })
  if (!res.ok) throw new Error('Failed to place order')
  return res.json()
}

export async function adminLogin(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Invalid credentials')
  return res.json()
}

// New — sends a message to the chat assistant
export async function sendChatMessage(message, history = []) {
  const res = await fetch(`${BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
  if (!res.ok) throw new Error('Failed to get a response')
  return res.json()
}

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pcp_token') : ''
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function getOrders() {
  const res = await fetch(`${BASE}/orders`, { headers: authHeaders() })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${BASE}/orders/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export async function deleteOrder(id) {
  await fetch(`${BASE}/orders/${id}`, { method: 'DELETE', headers: authHeaders() })
}

export async function createProduct(data) {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create product')
  return res.json()
}

export async function updateProduct(id, data) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update product')
  return res.json()
}

export async function deleteProduct(id) {
  await fetch(`${BASE}/products/${id}`, { method: 'DELETE', headers: authHeaders() })
}
