'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // Load cart from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem('pcp_cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('pcp_cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(product, quantity = 1, color = null) {
    setCart(prev => {
      const key = `${product.id}-${color}`
      const existing = prev.find(i => `${i.id}-${i.selectedColor}` === key)
      if (existing) {
        toast.success('Quantity updated!')
        return prev.map(i =>
          `${i.id}-${i.selectedColor}` === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      toast.success('Added to cart!')
      return [...prev, { ...product, quantity, selectedColor: color }]
    })
  }

  function removeFromCart(id, color) {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedColor === color)))
  }

  function updateQuantity(id, color, qty) {
    if (qty < 1) { removeFromCart(id, color); return }
    setCart(prev =>
      prev.map(i => i.id === id && i.selectedColor === color ? { ...i, quantity: qty } : i)
    )
  }

  function clearCart() { setCart([]) }

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)
  const subtotal   = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
