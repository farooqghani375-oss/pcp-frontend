'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { placeOrder } from '@/lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const SHIPPING = 250

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', notes: '' })
  const [payment, setPayment] = useState('cod')
  const [loading, setLoading] = useState(false)

  const total = subtotal + (cart.length > 0 ? SHIPPING : 0)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleOrder() {
  if (!form.name || !form.phone || !form.address) {
    toast.error('Please fill in your name, phone and address')
    return
  }

  setLoading(true)
  try {
    const orderData = {
      customer: form,
      items: cart.map(i => ({
        productId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        color: i.selectedColor,
      })),
      subtotal,
      shipping: SHIPPING,
      total,
      payment,
    }

    const result = await placeOrder(orderData)

    clearCart()
    toast.success(`Order #${result.orderId} placed successfully!`)
    router.push('/')
  } catch (err) {
    toast.error('Failed to place order. Please try again.')
  } finally {
    setLoading(false)
  }
}
  if (totalItems === 0) {
    return (
      <div className="pt-14 max-w-lg mx-auto px-4 text-center py-20">
        <p className="text-6xl mb-4">🛒</p>
        <p className="text-gray-600 font-semibold mb-2">Your cart is empty</p>
        <Link href="/shop" className="inline-block mt-3 bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-14 max-w-lg mx-auto px-4 pb-6">
      <h1 className="text-lg font-bold text-gray-800 mt-4 mb-4">Your Cart ({totalItems})</h1>

      {/* Cart items */}
      <div className="flex flex-col gap-3 mb-6">
        {cart.map(item => (
          <div key={`${item.id}-${item.selectedColor}`} className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm">
            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
              {item.images?.[0] ? (
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
              {item.selectedColor && (
                <span className="inline-block w-3 h-3 rounded-full mt-0.5" style={{ backgroundColor: item.selectedColor }} />
              )}
              <p className="text-sm font-bold text-primary-dark mt-0.5">Rs {(item.price * item.quantity).toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <button onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                  className="w-6 h-6 rounded-full bg-gray-100 text-sm font-bold flex items-center justify-center">−</button>
                <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                  className="w-6 h-6 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">+</button>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id, item.selectedColor)} className="text-gray-300 hover:text-red-400 text-xl self-start">✕</button>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <h2 className="font-bold text-gray-800 mb-3">Order Summary</h2>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Subtotal</span><span>Rs {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Shipping</span><span>Rs {SHIPPING}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
          <span>Total</span><span className="text-primary-dark">Rs {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Customer form */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <h2 className="font-bold text-gray-800 mb-3">Delivery Details</h2>
        <div className="flex flex-col gap-2.5">
          {[
            { name: 'name',    placeholder: 'Full Name *',    type: 'text'  },
            { name: 'phone',   placeholder: 'Phone Number *', type: 'tel'   },
            { name: 'address', placeholder: 'Address *',      type: 'text'  },
            { name: 'city',    placeholder: 'City',           type: 'text'  },
          ].map(f => (
            <input
              key={f.name}
              name={f.name}
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.name]}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          ))}
          <textarea
            name="notes"
            placeholder="Order notes (optional)"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
          />
        </div>
      </div>

      {/* Payment */}
      
<div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
  <h2 className="font-bold text-gray-800 mb-3">Payment Method</h2>
  <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl border-2 border-primary bg-green-50 text-primary-dark text-sm font-semibold">
    💵 Cash on Delivery
  </div>
</div>

      {/* Place order */}
      <button
        onClick={handleOrder}
        disabled={loading}
        className="w-full bg-primary text-white font-bold py-4 rounded-full text-base hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {loading ? 'Placing Order...' : `Place Order — Rs ${total.toLocaleString()}`}
      </button>
    </div>
  )
}
