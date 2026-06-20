'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

const CATS = ['all', 'plants', 'pots', 'tools', 'fertilizers']

export default function ShopClient({ products }) {
  const searchParams = useSearchParams()
  const [active, setActive] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const cat = searchParams.get('category')
    const q   = searchParams.get('search')
    if (cat) setActive(cat)
    if (q)   setSearch(q)
  }, [searchParams])

  const filtered = products.filter(p => {
    const matchCat    = active === 'all' || p.category === active
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="pt-14 lg:pt-16 max-w-7xl mx-auto px-4 lg:px-8">

      {/* Page title */}
      <div className="mt-6 lg:mt-10 mb-5 lg:mb-8">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-800">Our Products</h1>
        <p className="text-sm text-gray-400 mt-1">Plants, pots, fertilizers, tools and seeds — all in one place</p>
      </div>

      {/* Search + filters row */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 lg:items-center mb-5">
        <input
          type="text"
          placeholder="Search plants, pots, tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full lg:max-w-sm border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary bg-white shadow-sm"
        />
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs lg:text-sm font-semibold capitalize transition-colors ${
                active === c
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
            >
              {c === 'all' ? 'All Products' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs lg:text-sm text-gray-400 mb-4">{filtered.length} products found</p>

      {/* Grid — 2 cols mobile, 3 cols tablet, 4 cols desktop, 5 cols xl */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🌵</p>
          <p className="text-gray-500">No products found for "{search || active}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-5 pb-8">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
