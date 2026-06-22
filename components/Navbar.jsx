'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getProducts } from '@/lib/api'

const NAV_LINKS = [
  { label: 'Home',    href: '/'        },
  { label: 'Shop',    href: '/shop'    },
  { label: 'About',   href: '/about'   },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const { totalItems } = useCart()
  const [search, setSearch]         = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const router = useRouter()
  const pathname = usePathname()
  const searchRef = useRef(null)
  const desktopSearchRef = useRef(null)

  // Load product list once for instant client-side suggestions
  useEffect(() => {
    getProducts().then(setAllProducts).catch(() => {})
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchRef.current && !searchRef.current.contains(e.target) &&
        desktopSearchRef.current && !desktopSearchRef.current.contains(e.target)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter suggestions as user types
  useEffect(() => {
    if (search.trim().length === 0) {
      setSuggestions([])
      setHighlighted(-1)
      return
    }
    const q = search.toLowerCase()
    const matches = allProducts
      .filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 6)
    setSuggestions(matches)
    setHighlighted(-1)
  }, [search, allProducts])

  function goToSearch(query) {
    if (!query.trim()) return
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`)
    setShowSuggestions(false)
    setShowSearch(false)
    setSearch('')
  }

  function goToProduct(product) {
    router.push(`/product/${product.slug}`)
    setShowSuggestions(false)
    setShowSearch(false)
    setSearch('')
  }

  function handleKeyDown(e) {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') goToSearch(search)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(i => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(i => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0) goToProduct(suggestions[highlighted])
      else goToSearch(search)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  // ── Reusable suggestions dropdown ──
  function SuggestionsDropdown() {
    if (!showSuggestions || search.trim().length === 0) return null
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
        {suggestions.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            No products found for "{search}"
          </div>
        ) : (
          <>
            {suggestions.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goToProduct(p)}
                onMouseEnter={() => setHighlighted(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  highlighted === i ? 'bg-green-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-800 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400 capitalize">{p.category}</p>
                </div>
                <p className="text-xs font-semibold text-primary-dark flex-shrink-0">Rs {Number(p.price).toLocaleString()}</p>
              </button>
            ))}
            {/* "See all results" footer */}
            <button
              onClick={() => goToSearch(search)}
              className="w-full px-4 py-2.5 text-left text-xs font-semibold text-primary hover:bg-green-50 transition-colors border-t border-gray-100"
            >
              🔍 See all results for "{search}"
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-8 h-14 lg:h-16 max-w-7xl mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/images/logo.jpeg" alt="Plant Center Peshawar" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover" />
          <div className="leading-tight">
            <p className="text-xs lg:text-sm font-bold text-primary-dark uppercase tracking-wide">Plant Center</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Peshawar</p>
          </div>
        </Link>

        {/* Desktop search bar — center, with suggestions */}
        <div ref={desktopSearchRef} className="hidden lg:flex flex-1 max-w-md mx-8 relative">
          <div className="relative w-full">
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search plants, pots..."
              className="w-full border border-gray-200 rounded-full px-5 py-2 text-sm outline-none focus:border-primary bg-gray-50"
            />
            <button onClick={() => goToSearch(search)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <SuggestionsDropdown />
        </div>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                pathname === link.href ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary hover:bg-green-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-3 ml-3">
          {/* Mobile search toggle */}
          {showSearch ? (
            <div ref={searchRef} className="relative lg:hidden w-full">
              <div className="flex items-center gap-1">
              <input
  autoFocus
  value={search}
  onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }}
  onFocus={() => setShowSuggestions(true)}
  onKeyDown={handleKeyDown}
  placeholder="Search plants, pots..."
  className="border border-gray-200 rounded-full px-4 py-2 text-sm w-52 outline-none focus:border-primary bg-gray-50"
/>
                <button type="button" onClick={() => { setShowSearch(false); setShowSuggestions(false) }} className="text-gray-400 text-lg">✕</button>
              </div>
              <SuggestionsDropdown />
            </div>
          ) : (
            <button onClick={() => setShowSearch(true)} className="text-gray-600 lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}

          <Link href="/cart" className="relative">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
