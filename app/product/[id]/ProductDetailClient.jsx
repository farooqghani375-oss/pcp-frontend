'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart()
  const router = useRouter()
  const [imgIdx, setImgIdx] = useState(0)
  const [color, setColor]   = useState(product.colors?.[0] || null)
  const [qty, setQty]       = useState(1)

  const images = product.images?.length ? product.images : []

  return (
    <div className="pt-14 lg:pt-16 max-w-6xl mx-auto px-4 lg:px-8">

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mt-4 lg:mt-6 mb-4"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Main content — stacked on mobile, side by side on desktop */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">

        {/* ── LEFT: Images ── */}
        <div className="w-full lg:w-[360px] flex flex-col gap-3">
          {/* Main image */}
          <div className="rounded-2xl lg:rounded-2xl border border-r-4 overflow-hidden bg-white h-72 lg:h-[320px]">
            {images[imgIdx] ? (
              <img
                src={`/images/${images[imgIdx]}`}
                alt={product.name}
                className="block w-full h-full object-contain object-center"
                onError={e => { e.target.style.display = 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl lg:text-9xl">🌿</div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    imgIdx === i ? 'border-primary' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={`/images/${img}`}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Info ── */}
        <div className="lg:w-1/2 flex flex-col pb-8">
          {/* Category + name */}
          <p className="text-xs lg:text-sm text-primary font-semibold uppercase tracking-widest">
            {product.category}
          </p>
          <h1 className="text-xl lg:text-4xl font-extrabold text-gray-900 mt-1 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-2xl lg:text-4xl font-extrabold text-primary-dark mt-3">
            Rs {Number(product.price).toLocaleString()}
          </p>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Description */}
          {product.description && (
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Color picker */}
          {product.colors?.length > 0 && (
            <div className="mt-5">
              <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-2">
                Color
                {color && (
                  <span className="ml-2 font-normal text-gray-400">{color}</span>
                )}
              </p>
              <div className="flex gap-2.5">
                {product.colors.map(hex => (
                  <button
                    key={hex}
                    onClick={() => setColor(hex)}
                    style={{ backgroundColor: hex }}
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                      color === hex ? 'border-primary-dark scale-110 shadow-md' : 'border-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-5">
            <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white text-lg font-bold flex items-center justify-center hover:bg-gray-200 transition-colors"
              >−</button>
              <span className="w-8 text-center font-bold text-lg">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-primary text-white text-lg font-bold flex items-center justify-center hover:bg-primary-dark transition-colors"
              >+</button>
            </div>
          </div>

          {/* Stock status */}
          <p className={`text-xs lg:text-sm mt-4 font-medium ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
            {product.in_stock
              ? `✓ In Stock — ${product.stock_qty} available`
              : '✗ Out of Stock'}
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => addToCart(product, qty, color)}
              disabled={!product.in_stock}
              className="flex-1 border-2 border-primary text-primary font-bold py-3 lg:py-4 rounded-full text-sm lg:text-base
                         hover:bg-green-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button
              onClick={() => { addToCart(product, qty, color); router.push('/cart') }}
              disabled={!product.in_stock}
              className="flex-1 bg-primary text-white font-bold py-3 lg:py-4 rounded-full text-sm lg:text-base
                         hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* Delivery info */}
          <div className="mt-6 bg-green-50 rounded-2xl p-4 flex flex-col gap-2">
            {[
              { icon: '🚚', text: 'Free delivery on orders above Rs 2,000' },
              { icon: '🔄', text: 'Easy returns within 7 days'             },
              { icon: '💬', text: 'WhatsApp support available anytime'     },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-2.5">
                <span className="text-base">{item.icon}</span>
                <span className="text-xs lg:text-sm text-gray-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
