'use client'
import { useState } from 'react'
import { adminLogin } from '@/lib/api'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await adminLogin(form.email, form.password)
      localStorage.setItem('pcp_token', data.token)
      toast.success('Welcome back!')
      router.push('/admin/dashboard')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-3xl mx-auto mb-3">🌿</div>
          <h1 className="text-xl font-bold text-gray-800">PCP Admin</h1>
          <p className="text-xs text-gray-400 mt-1">Plant Center Peshawar</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white font-bold py-3 rounded-xl mt-2 hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
