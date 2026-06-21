'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.message) {
      toast.error('Please fill in your name and message')
      return
    }
    // Send via WhatsApp
    const msg = encodeURIComponent(
      `*Contact Form — PCP*\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
    )
    window.open(`https://wa.me/923199004866?text=${msg}`, '_blank')
    toast.success('Opening WhatsApp...')
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="pt-14 lg:pt-16">

      {/* Hero */}
      <section
        className="px-6 py-14 lg:py-20 text-center"
        style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #52b788 100%)' }}
      >
        <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-3">📬 Get In Touch</p>
        <h1 className="text-white text-3xl lg:text-5xl font-extrabold">Contact Us</h1>
        <p className="text-green-200 text-sm mt-3">We're here to help. Reach out anytime!</p>
      </section>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Contact info */}
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">Find Us</h2>
            <div className="flex flex-col gap-5">
              {[
                { icon: '📍', title: 'Address',  value: 'University Road, Peshawar, KPK, Pakistan'                        },
                { icon: '📞', title: 'Phone',    value: '92 319 9004866'                                                 },
                { icon: '💬', title: 'WhatsApp', value: '92 319 9004866'                                                 },
                { icon: '🕐', title: 'Hours',    value: 'Mon–Sat: 9am – 8pm\nSunday: 10am – 6pm'                         },
              ].map(item => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5 whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="mt-8">
              <p className="font-semibold text-gray-800 text-sm mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { label: 'Facebook',  color: 'bg-blue-600',  emoji: '📘' },
                  { label: 'Instagram', color: 'bg-pink-500',  emoji: '📸' },
                  { label: 'WhatsApp',  color: 'bg-green-500', emoji: '💬' },
                ].map(s => (
                  <button
                    key={s.label}
                    className={`${s.color} text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5`}
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="name"
                placeholder="Your Name *"
                value={form.name}
                onChange={handleChange}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <textarea
                name="message"
                placeholder="Your message... *"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
              >
                💬 Send via WhatsApp
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
