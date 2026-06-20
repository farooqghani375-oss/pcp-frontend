import Link from 'next/link'

export const metadata = { title: 'About — Plant Center Peshawar' }

export default function AboutPage() {
  return (
    <div className="pt-14 lg:pt-16">

      {/* Hero */}
      <section
        className="relative px-6 lg:px-16 py-16 lg:py-24 flex flex-col items-center text-center"
        style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #52b788 100%)' }}
      >
        <div className="absolute -left-10 top-10 w-40 h-40 rounded-full bg-white opacity-5" />
        <div className="absolute -right-10 bottom-10 w-56 h-56 rounded-full bg-white opacity-5" />
        <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-3">🌿 Our Story</p>
        <h1 className="text-white text-3xl lg:text-5xl font-extrabold max-w-xl leading-tight">
          Bringing Nature Closer to Your Home
        </h1>
        <p className="text-green-200 text-sm lg:text-base mt-4 max-w-lg">
          Plant Center Peshawar — Peshawar's most trusted plant store since 2019.
        </p>
      </section>

      {/* Story section */}
      <section className="max-w-5xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">Who We Are</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight mb-4">
              A Family Business Rooted in Peshawar
            </h2>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4">
              We started as a small family nursery in Peshawar with a simple mission — make quality plants, pots, and gardening tools accessible to everyone. What began as a passion for greenery quickly grew into the city's most loved plant destination.
            </p>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              Today we carry hundreds of plant varieties, handpicked pots, organic fertilizers, and professional tools — all carefully selected so your garden thrives no matter your experience level.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🌱', label: 'Plants',     value: '200+',  desc: 'Varieties available'    },
              { icon: '🪴', label: 'Pots',       value: '50+',   desc: 'Styles and sizes'       },
              { icon: '😊', label: 'Customers',  value: '5000+', desc: 'Happy customers'        },
              { icon: '📦', label: 'Orders',     value: '10k+',  desc: 'Delivered across KPK'  },
            ].map(s => (
              <div key={s.label} className="bg-cream rounded-2xl p-5 text-center">
                <p className="text-3xl mb-2">{s.icon}</p>
                <p className="text-2xl font-extrabold text-primary-dark">{s.value}</p>
                <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest text-center mb-3">Why Choose Us</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '✅', title: 'Quality Guaranteed',   desc: 'Every plant is healthy, pest-free, and hand-inspected before it reaches you.'       },
              { icon: '🚚', title: 'Fast Local Delivery',  desc: 'Same-day delivery across Peshawar. We handle your plants with care.'                },
              { icon: '💬', title: 'Expert Advice',        desc: 'Not sure which plant to pick? Our team gives free guidance via WhatsApp anytime.'   },
            ].map(v => (
              <div key={v.title} className="bg-cream rounded-2xl p-6 text-center">
                <p className="text-4xl mb-3">{v.icon}</p>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">Ready to Start Your Garden?</h2>
        <p className="text-gray-500 text-sm mb-6">Browse our full collection of plants, pots, and tools.</p>
        <Link
          href="/shop"
          className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors"
        >
          Shop Now
        </Link>
      </section>

    </div>
  )
}
