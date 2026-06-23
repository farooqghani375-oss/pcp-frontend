'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('pcp_cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('pcp_cart', JSON.stringify(cart))
  }, [cart])

  // size is an object { size_label, unit } or null
  function addToCart(product, quantity = 1, color = null, size = null) {
    setCart(prev => {
      const sizeKey = size ? `${size.size_label}-${size.unit}` : 'none'
      const key = `${product.id}-${color}-${sizeKey}`
      const existing = prev.find(i => {
        const iSizeKey = i.selectedSize ? `${i.selectedSize.size_label}-${i.selectedSize.unit}` : 'none'
        return `${i.id}-${i.selectedColor}-${iSizeKey}` === key
      })
      if (existing) {
        toast.success('Quantity updated!')
        return prev.map(i => {
          const iSizeKey = i.selectedSize ? `${i.selectedSize.size_label}-${i.selectedSize.unit}` : 'none'
          return `${i.id}-${i.selectedColor}-${iSizeKey}` === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        })
      }
      toast.success('Added to cart!')
      return [...prev, { ...product, quantity, selectedColor: color, selectedSize: size }]
    })
  }

  function removeFromCart(id, color, size = null) {
    setCart(prev => prev.filter(i => {
      const sameId    = i.id === id
      const sameColor = i.selectedColor === color
      const sizeKey   = size ? `${size.size_label}-${size.unit}` : 'none'
      const iSizeKey  = i.selectedSize ? `${i.selectedSize.size_label}-${i.selectedSize.unit}` : 'none'
      const sameSize  = iSizeKey === sizeKey
      return !(sameId && sameColor && sameSize)
    }))
  }

  function updateQuantity(id, color, qty, size = null) {
    if (qty < 1) { removeFromCart(id, color, size); return }
    setCart(prev => prev.map(i => {
      const sizeKey  = size ? `${size.size_label}-${size.unit}` : 'none'
      const iSizeKey = i.selectedSize ? `${i.selectedSize.size_label}-${i.selectedSize.unit}` : 'none'
      return i.id === id && i.selectedColor === color && iSizeKey === sizeKey
        ? { ...i, quantity: qty }
        : i
    }))
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
