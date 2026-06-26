'use client'
import { useState, useRef, useEffect } from 'react'

const CHAT_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 🌿 I'm here to help with plants, pots, orders, or anything else. What can I help you find?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [wakingUp, setWakingUp] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  async function sendChatMessage(message, history = []) {
    const controller = new AbortController()
    // 25 seconds — enough time for Render free tier to wake up
    const timeout = setTimeout(() => controller.abort(), 25000)
    try {
      const res = await fetch(`${CHAT_API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error('Failed to get a response')
      return res.json()
    } finally {
      clearTimeout(timeout)
    }
  }

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setWakingUp(false)

    // After 5 seconds still loading → show "waking up" hint
    const wakeTimer = setTimeout(() => setWakingUp(true), 5000)

    try {
      const history = newMessages.slice(-8).map(m => ({ role: m.role, content: m.content }))
      const { reply } = await sendChatMessage(text, history.slice(0, -1))
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      const msg = err.name === 'AbortError'
        ? "⏱ Taking too long! The server is waking up — please try again in a moment, or message us on WhatsApp!"
        : "Sorry, I'm having trouble responding right now. Try WhatsApp or check back in a moment!"
      setMessages(prev => [...prev, { role: 'assistant', content: msg }])
    } finally {
      clearTimeout(wakeTimer)
      setLoading(false)
      setWakingUp(false)
    }
  }

  return (
    <>
      {!open && (
  <div className="fixed right-4 bottom-[116px] z-40 flex flex-col items-center gap-1">
    <span className="bg-primary text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md whitespace-nowrap">
      AI Help 🤖
    </span>
    <button
      onClick={() => setOpen(true)}
      className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat with us"
    >
      <span className="text-white text-2xl leading-none">🤖</span>
    </button>
  </div>
)}

      {open && (
        <div
          className="fixed right-4 bottom-[116px] z-40 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          style={{ height: 'min(28rem, calc(100vh - 13rem))' }}
        >
          {/* Header */}
          <div className="bg-primary-dark text-white px-4 py-3 flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center text-lg">🤖</div>
            <div className="flex-1">
              <p className="text-sm font-bold leading-tight">Plant Center Assistant</p>
              <p className="text-[10px] text-green-300">
                {wakingUp ? '⏳ Waking up server...' : 'Usually replies instantly'}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white text-lg leading-none px-1"
              aria-label="Close chat"
            >✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-white self-end rounded-br-md'
                    : 'bg-white text-gray-700 self-start rounded-bl-md shadow-sm'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-white text-gray-400 self-start rounded-2xl rounded-bl-md px-3 py-2 text-sm shadow-sm">
                {wakingUp ? '⏳ Server waking up, almost there...' : 'Typing...'}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 bg-white flex-shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about plants, orders..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-40 flex-shrink-0"
            >➤</button>
          </form>
        </div>
      )}
    </>
  )
}