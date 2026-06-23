'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart()
  const router = useRouter()

  const images = product.images?.length ? product.images : []

  // colors come as objects: { hex_color, stock_qty, image_url }
  // support old format (plain string) too just in case
  const colors = (product.colors || []).map(c =>
    typeof c === 'string'
      ? { hex_color: c, stock_qty: 0, image_url: null }
      : c
  )

  const sizes = product.sizes || []

  // Active color index
  const [activeColorIdx, setActiveColorIdx] = useState(colors.length > 0 ? 0 : null)

  // Per-color quantities: { colorIndex: qty }
  const [colorQtys, setColorQtys] = useState(
    colors.reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {})
  )

  // Single qty for products with no colors
  const [qty, setQty] = useState(1)

  // Selected size
  const [selectedSize, setSelectedSize] = useState(sizes.length > 0 ? sizes[0] : null)

  // Main image index (for thumbnails)
  const [imgIdx, setImgIdx] = useState(0)

  const activeColor = activeColorIdx !== null ? colors[activeColorIdx] : null

  // When a color is clicked: set as active + switch main image to that color's image
  function handleColorClick(i) {
    setActiveColorIdx(i)
    const colorImg = colors[i]?.image_url
    if (colorImg) {
      // find index of this color image in images array, or just show it directly
      const foundIdx = images.indexOf(colorImg)
      if (foundIdx !== -1) {
        setImgIdx(foundIdx)
      } else {
        // color has its own image not in thumbnails — show it as main
        setImgIdx(-1) // -1 = show color image directly
      }
    }
  }

  function updateColorQty(i, delta) {
    setColorQtys(prev => ({
      ...prev,
      [i]: Math.max(0, (prev[i] || 0) + delta)
    }))
  }

  // Build the main image src
  function getMainImageSrc() {
    if (imgIdx === -1 && activeColor?.image_url) return activeColor.image_url
    return images[imgIdx] || null
  }

  // Total quantity across all colors (or single qty)
  const totalQty = colors.length > 0
    ? Object.values(colorQtys).reduce((s, q) => s + q, 0)
    : qty

  // Build selections summary for cart/order
  function buildSelections() {
    if (colors.length === 0) {
      return [{ color: null, qty }]
    }
    return colors
      .map((c, i) => ({ color: c.hex_color, qty: colorQtys[i] || 0 }))
      .filter(s => s.qty > 0)
  }

  function handleAddToCart() {
    const selections = buildSelections()
    if (selections.length === 0 || totalQty === 0) return
    selections.forEach(({ color, qty }) => {
      addToCart(product, qty, color, selectedSize)
    })
  }

  function handleBuyNow() {
    handleAddToCart()
    router.push('/cart')
  }

  const mainImageSrc = getMainImageSrc()

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

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">

        {/* ── LEFT: Images ── */}
        <div className="w-full lg:w-[360px] flex flex-col gap-3">
          {/* Main image */}
          <div className="rounded-2xl border border-r-4 overflow-hidden bg-white h-72 lg:h-[320px]">
            {mainImageSrc ? (
              <img
                src={mainImageSrc}
                alt={product.name}
                className="block w-full h-full object-contain object-center transition-all duration-300"
                onError={e => { e.target.style.display = 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl lg:text-9xl">🌿</div>
            )}
          </div>

          {/* Thumbnails — only show if imgIdx is not -1 (color image override) */}
          {images.length > 1 && imgIdx !== -1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setImgIdx(i); setActiveColorIdx(null) }}
                  className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    imgIdx === i ? 'border-primary' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                </button>
              ))}
            </div>
          )}

          {/* If showing color image, show "back to product images" hint */}
          {imgIdx === -1 && images.length > 0 && (
            <button
              onClick={() => setImgIdx(0)}
              className="text-xs text-gray-400 hover:text-primary transition-colors text-center"
            >
              ← View all product images
            </button>
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

          <div className="border-t border-gray-100 my-4" />

          {/* Description */}
          {product.description && (
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* ── COLORS with per-color qty ── */}
          {colors.length > 0 && (
            <div className="mt-5">
              <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-3">
                Colors & Quantity
              </p>
              <div className="flex flex-col gap-3">
                {colors.map((c, i) => {
                  const isActive = activeColorIdx === i
                  const colorStock = c.stock_qty ?? 0
                  const colorQty = colorQtys[i] || 0
                  const outOfStock = colorStock === 0

                  return (
                    <div
                      key={i}
                      onClick={() => !outOfStock && handleColorClick(i)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-primary bg-green-50'
                          : outOfStock
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {/* Color dot */}
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${isActive ? 'border-primary' : 'border-gray-300'}`}
                        style={{ backgroundColor: c.hex_color }}
                      />

                      {/* Color image preview (small) */}
                      {c.image_url && (
                        <img
                          src={c.image_url}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        />
                      )}

                      {/* Stock info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">
                          {outOfStock
                            ? '✗ Out of stock'
                            : `${colorStock} available`}
                        </p>
                      </div>

                      {/* Qty counter — only show when active and in stock */}
                      {isActive && !outOfStock && (
                        <div
                          className="flex items-center gap-2"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => updateColorQty(i, -1)}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 text-lg font-bold flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >−</button>
                          <span className="w-6 text-center font-bold text-sm">{colorQty}</span>
                          <button
                            onClick={() => updateColorQty(i, 1)}
                            disabled={colorQty >= colorStock}
                            className="w-8 h-8 rounded-full bg-primary text-white text-lg font-bold flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-40"
                          >+</button>
                        </div>
                      )}

                      {/* Show qty badge when not active but qty > 0 */}
                      {!isActive && colorQty > 0 && (
                        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          ×{colorQty}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Total selected summary */}
              {totalQty > 0 && (
                <p className="text-xs text-primary font-semibold mt-2">
                  ✓ {totalQty} item{totalQty !== 1 ? 's' : ''} selected
                  {buildSelections().length > 1 && ` across ${buildSelections().length} colors`}
                </p>
              )}
            </div>
          )}

          {/* ── Single qty (no colors) ── */}
          {colors.length === 0 && (
            <div className="mt-5">
              <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white border border-gray-200 text-lg font-bold flex items-center justify-center hover:bg-gray-100 transition-colors"
                >−</button>
                <span className="w-8 text-center font-bold text-lg">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-primary text-white text-lg font-bold flex items-center justify-center hover:bg-primary-dark transition-colors"
                >+</button>
              </div>
            </div>
          )}

          {/* ── SIZE DROPDOWN ── */}
          {sizes.length > 0 && (
            <div className="mt-5">
              <p className="text-xs lg:text-sm font-semibold text-gray-700 mb-2">Size</p>
              <select
                value={selectedSize ? `${selectedSize.size_label}-${selectedSize.unit}` : ''}
                onChange={e => {
                  const [label, unit] = e.target.value.split('-')
                  setSelectedSize({ size_label: label, unit })
                }}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary bg-white font-medium text-gray-700"
              >
                {sizes.map((s, i) => (
                  <option key={i} value={`${s.size_label}-${s.unit}`}>
                    {s.size_label} {s.unit}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Stock status */}
          <p className={`text-xs lg:text-sm mt-4 font-medium ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
            {product.in_stock
              ? `✓ In Stock — ${product.stock_qty} available`
              : '✗ Out of Stock'}
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock || totalQty === 0}
              className="flex-1 border-2 border-primary text-primary font-bold py-3 lg:py-4 rounded-full text-sm lg:text-base
                         hover:bg-green-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.in_stock || totalQty === 0}
              className="flex-1 bg-primary text-white font-bold py-3 lg:py-4 rounded-full text-sm lg:text-base
                         hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* Delivery info */}
          <div className="mt-6 bg-green-50 rounded-2xl p-4 flex flex-col gap-2">
            {[
              { icon: '🔄', text: 'Easy returns within 7 days'         },
              { icon: '💬', text: 'WhatsApp support available anytime'  },
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
