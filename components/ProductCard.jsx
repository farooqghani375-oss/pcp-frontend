'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const image = product.images?.[0]

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <Link href={`/product/${product.id}`} className="block relative">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-contain object-center hover:scale-105 transition-transform duration-300"
              onError={e => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🌿</div>
          )}
        </div>
        {product.featured && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Featured
          </span>
        )}
      </Link>

      <div className="p-3 lg:p-4 flex flex-col gap-1 flex-1">
        <p className="text-[10px] lg:text-xs text-primary font-semibold uppercase tracking-wide">{product.category}</p>
        <Link href={`/product/${product.id}`}>
          <p className="text-sm lg:text-base font-semibold text-gray-800 leading-tight line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </p>
        </Link>
        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="text-base lg:text-lg font-bold text-primary-dark">
            Rs {Number(product.price).toLocaleString()}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-primary-dark transition-colors"
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  )
}
