'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'

// ── Hero carousel slides ─────────────────────────────────────
// Each slide has its own background color and text.
// Add your own images to public/images/ and set `image` to the filename.
const SLIDES = [
  {
    image: 'b1.png', // e.g. 'hero1.jpg' — add your own hero image
    bg: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #52b788 100%)',
    // tag: '🌿 Peshawar\'s #1 Plant Store',
    // title: 'Redesign Your Home\nWith Nature',
    // sub: 'Your source for every plant, pot, and tool for any space.',
    // btn: 'Shop Collections',
    href: '/shop',
  },
  {
    image: 'b2.png',
    bg: 'linear-gradient(135deg, #1a3a2a 0%, #2d5a3f 60%, #40916c 100%)',
    // tag: '🪴 New Arrivals',
    // title: 'Fresh Plants\nJust Arrived',
    // sub: 'Over 200 varieties — from succulents to statement trees.',
    // btn: 'See New Arrivals',
    href: '/shop?category=plants',
  },
  
  {
    image: 'b3.png',
    bg: 'linear-gradient(135deg, #1b3a2a 0%, #386641 60%, #6a994e 100%)',
    // tag: '🔧 Gardening Tools',
    // title: 'Everything Your\nGarden Needs',
    // sub: 'Quality pots, fertilizers, tools — all in one place.',
    // btn: 'Shop Tools & Pots',
    href: '/shop?category=pots',
  },
  {
    image: 'b2.png',
    bg: 'linear-gradient(135deg, #1b3a2a 0%, #386641 60%, #6a994e 100%)',
    // tag: '🔧 Gardening Tools',
    // title: 'Everything Your\nGarden Needs',
    // sub: 'Quality pots, fertilizers, tools — all in one place.',
    // btn: 'Shop Tools & Pots',
    href: '/shop?category=pots',
  },
]

// ── Category cards — use your real product images ────────────
// Set `image` to a filename from your public/images/ folder.
// If the image doesn't exist it gracefully falls back to the emoji.
const CATEGORIES = [
  { label: 'Plants',      emoji: '🌱', image: '12.webp',  href: '/shop?category=plants'      },
  { label: 'Pots',        emoji: '🪴', image: 'pro (3).png',  href: '/shop?category=pots'        },
  { label: 'Fertilizers', emoji: '🌿', image: 'fert1.jpeg',    href: '/shop?category=fertilizers' },
  { label: 'Tools',       emoji: '🔧', image: 'tool1.jpeg',    href: '/shop?category=tools'       },
  { label: 'Seeds',       emoji: '🌾', image: 'seed1.jpeg',   href: '/shop'                      },
]

export default function HomeClient({ products, marqueeProducts }) {
  const { addToCart } = useCart()
  const featured = products.filter(p => p.featured)
  const [slide, setSlide] = useState(0)

  // Auto-advance carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(s => (s + 1) % SLIDES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const current = SLIDES[slide]

  return (
    <div className="pt-14 lg:pt-16">

      {/* ── HERO CAROUSEL ──────────────────────────────────── */}
      <section className="relative overflow-hidden h-44 lg:h-[420px] w-full max-w-none">
        {/* Slides */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              background: s.bg,
              opacity: i === slide ? 1 : 0,
              zIndex: i === slide ? 1 : 0,
            }}
          >
            {/* Optional background image */}
            {s.image && (
              <img
                src={`/images/${s.image}`}
                alt=""
                className="absolute inset-0 min-w-full min-h-full w-full h-full object-cover object-center"
              />
            )}

            {/* Text content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16 max-w-7xl mx-auto">
              <p className="text-green-300 text-[10px] lg:text-xs font-semibold uppercase tracking-widest mb-2">
                {s.tag}
              </p>
              <h1 className="text-white text-xl lg:text-4xl font-extrabold leading-tight max-w-xs lg:max-w-xl whitespace-pre-line">
                {s.title}
              </h1>
              <p className="text-green-200 text-sm lg:text-base mt-2 max-w-xs lg:max-w-md">{s.sub}</p>
              <Link
                href={s.href}
                className="inline-block mt-4 lg:mt-5 bg-white text-primary-dark text-[10px] lg:text-xs font-bold
                           px-4 lg:px-6 py-2 lg:py-2.5 rounded-full hover:bg-green-50 transition-colors
                           uppercase tracking-wide w-fit"
              >
                {s.btn}
              </Link>
            </div>
          </div>
        ))}

        {/* Arrow buttons */}
        <button
          onClick={() => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 lg:w-10 lg:h-10
                     bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center
                     transition-colors backdrop-blur-sm"
        >
          ‹
        </button>
        <button
          onClick={() => setSlide(s => (s + 1) % SLIDES.length)}
          className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 lg:w-10 lg:h-10
                     bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center
                     transition-colors backdrop-blur-sm"
        >
          ›
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 lg:bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`transition-all rounded-full ${
                i === slide
                  ? 'w-5 lg:w-6 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <section className="px-4 lg:px-8 mt-8 lg:mt-12 max-w-7xl mx-auto">
        <h2 className="text-sm lg:text-xl font-bold text-gray-700 uppercase tracking-wide text-center mb-5 lg:mb-8">
          Shop Categories
        </h2>
        <div className="flex gap-4 lg:gap-12 lg:justify-center overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex flex-col items-center gap-1.5 flex-shrink-0"
            >
              <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-green-100
                              hover:border-primary transition-colors shadow-md bg-white">
                {cat.image ? (
                  <img
                    src={`/images/${cat.image}`}
                    alt={cat.label}
                    className="w-full h-full object-cover"
                    onError={e => {
                      // Fallback to emoji if image not found
                      e.target.style.display = 'none'
                      e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl lg:text-5xl">${cat.emoji}</div>`
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl lg:text-5xl">
                    {cat.emoji}
                  </div>
                )}
              </div>
              <span className="text-[10px] lg:text-xs font-semibold text-gray-600 uppercase text-center w-16 lg:w-24 leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEW ARRIVALS (auto-scrolling marquee) ──────────── */}
      <section className="mt-8 lg:mt-12">
        <h2 className="text-sm lg:text-xl font-bold text-gray-700 uppercase tracking-wide text-center mb-5 lg:mb-8">
          New Arrivals
        </h2>
        <div className="overflow-hidden">
          <div className="marquee-track gap-3 lg:gap-5 px-2">
            {[...marqueeProducts, ...marqueeProducts].map((p, i) => (
              <MarqueeCard key={`${p.id}-${i}`} product={p} onAdd={() => addToCart(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED GRID ──────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="px-4 lg:px-8 mt-10 lg:mt-14 pb-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-sm lg:text-xl font-bold text-gray-700 uppercase tracking-wide">Featured</h2>
            <Link href="/shop" className="text-xs lg:text-sm text-primary font-semibold hover:underline">See all →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5">
            {featured.map(p => (
              <FeaturedCard key={p.id} product={p} onAdd={() => addToCart(p)} />
            ))}
          </div>
        </section>
      )}

      {/* ── ALL PRODUCTS (desktop bonus section) ───────────── */}
      <section className="hidden lg:block px-8 mt-10 pb-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700 uppercase tracking-wide">All Products</h2>
          <Link href="/shop" className="text-sm text-primary font-semibold hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-4 xl:grid-cols-5 gap-5">
          {products.slice(0, 10).map(p => (
            <FeaturedCard key={p.id} product={p} onAdd={() => addToCart(p)} />
          ))}
        </div>
      </section>

    </div>
  )
}

/* ── Marquee card ── */
function MarqueeCard({ product, onAdd }) {
  const image = product.images?.[0]
  return (
    <div className="flex-shrink-0 w-36 lg:w-52 bg-white rounded-2xl shadow-sm overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="h-32 lg:h-44 bg-gray-100 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              onError={e => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🌿</div>
          )}
        </div>
      </Link>
      <div className="p-2 lg:p-3">
        <p className="text-xs lg:text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</p>
        <p className="text-[10px] lg:text-xs text-gray-400 capitalize">{product.category}</p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs lg:text-sm font-bold text-primary-dark">Rs {Number(product.price).toLocaleString()}</p>
          <button onClick={onAdd} className="bg-primary text-white text-[10px] lg:text-xs font-bold px-2 py-1 rounded-full">+</button>
        </div>
      </div>
    </div>
  )
}

/* ── Featured card ── */
function FeaturedCard({ product, onAdd }) {
  const image = product.images?.[0]
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={e => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl lg:text-6xl">🌿</div>
          )}
        </div>
        {product.featured && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Featured
          </span>
        )}
      </Link>
      <div className="p-2.5 lg:p-4 flex flex-col gap-1 flex-1">
        <p className="text-[10px] lg:text-xs text-primary font-semibold uppercase tracking-wide">{product.category}</p>
        <Link href={`/product/${product.slug}`}>
          <p className="text-sm lg:text-base font-semibold text-gray-800 leading-tight line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </p>
        </Link>
        <p className="text-sm lg:text-lg font-bold text-primary-dark mt-1">Rs {Number(product.price).toLocaleString()}</p>
        <button
          onClick={onAdd}
          className="w-full mt-2 bg-primary text-white text-xs lg:text-sm font-semibold py-2 lg:py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  )
}
