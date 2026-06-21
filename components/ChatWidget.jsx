'use client'
import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '@/lib/api'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 🌿 I'm here to help with plants, pots, orders, or anything else. What can I help you find?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  async function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = newMessages.slice(-8).map(m => ({ role: m.role, content: m.content }))
      const { reply } = await sendChatMessage(text, history.slice(0, -1))
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble responding right now. Try WhatsApp instead, or check back in a moment!"
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating toggle button — only shown when the panel is closed.
          Sits above the WhatsApp button (which is at bottom-6). */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-24 z-40 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Chat with us"
        >
          <span className="text-white text-2xl leading-none">🤖</span>
        </button>
      )}

      {/* Chat panel.
          bottom-24 keeps it clear of the WhatsApp button below.
          Height is capped by BOTH a max size (28rem) AND the available
          viewport space, so it can never render above the top of the screen
          no matter how short the browser window is. */}
      {open && (
        <div
          className="fixed right-4 bottom-24 z-40 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          style={{ height: 'min(28rem, calc(100vh - 12rem))' }}
        >
          {/* Header */}
          <div className="bg-primary-dark text-white px-4 py-3 flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center text-lg">🤖</div>
            <div className="flex-1">
              <p className="text-sm font-bold leading-tight">Plant Center Assistant</p>
              <p className="text-[10px] text-green-300">Usually replies instantly</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-lg leading-none px-1" aria-label="Close chat">
              ✕
            </button>
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
                Typing...
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
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  )
}
