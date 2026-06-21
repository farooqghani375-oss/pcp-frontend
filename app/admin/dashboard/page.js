'use client'
import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus, deleteOrder, deleteProduct, getProducts, createProduct, updateProduct } from '@/lib/api'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  Pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
}

const EMPTY_PRODUCT = {
  name: '', price: '', category: 'plants', description: '',
  featured: false, inStock: true, stockQty: 0,
  images: '', colors: ''
}

export default function AdminDashboard() {
  const router  = useRouter()
  const [tab, setTab]           = useState('dashboard')
  const [orders, setOrders]     = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [orderFilter, setOrderFilter]     = useState('All')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm]       = useState(EMPTY_PRODUCT)
  const [saving, setSaving]                 = useState(false)
  const [orderSearch, setOrderSearch]       = useState('')
  const [productSearch, setProductSearch]   = useState('')

  useEffect(() => {
    const token = localStorage.getItem('pcp_token')
    if (!token) { router.push('/admin'); return }
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [o, p] = await Promise.all([getOrders(), getProducts()])
      setOrders(o)
      setProducts(p)
    } catch {
      toast.error('Session expired')
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatus(orderId, status) {
    try {
      await updateOrderStatus(orderId, status)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      toast.success('Status updated')
    } catch { toast.error('Failed to update') }
  }

  async function handleDeleteOrder(id) {
    if (!confirm('Delete this order?')) return
    await deleteOrder(id)
    setOrders(prev => prev.filter(o => o.id !== id))
    toast.success('Order deleted')
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    setProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Product deleted')
  }

  function openEdit(product) {
    setEditingProduct(product.id)
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || '',
      featured: product.featured,
      inStock: product.in_stock,
      stockQty: product.stock_qty,
      images: product.images?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
    })
    setShowAddProduct(true)
  }

  function openAdd() {
    setEditingProduct(null)
    setProductForm(EMPTY_PRODUCT)
    setShowAddProduct(true)
  }

  async function handleSaveProduct(e) {
    e.preventDefault()
    if (!productForm.name || !productForm.price) {
      toast.error('Name and price are required')
      return
    }
    setSaving(true)
    try {
      const data = {
        ...productForm,
        price: Number(productForm.price),
        stockQty: Number(productForm.stockQty),
        images: productForm.images ? productForm.images.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: productForm.colors ? productForm.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
      }
      if (editingProduct) {
        const updated = await updateProduct(editingProduct, data)
        setProducts(prev => prev.map(p => p.id === editingProduct ? { ...p, ...updated } : p))
        toast.success('Product updated!')
      } else {
        const created = await createProduct(data)
        setProducts(prev => [...prev, created])
        toast.success('Product added!')
      }
      setShowAddProduct(false)
      setEditingProduct(null)
    } catch { toast.error('Failed to save product') }
    finally { setSaving(false) }
  }

  function logout() {
    localStorage.removeItem('pcp_token')
    router.push('/admin')
  }

  // Stats
  const pending   = orders.filter(o => o.status === 'Pending').length
  const delivered = orders.filter(o => o.status === 'Delivered').length
  const revenue   = orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + Number(o.total), 0)
  const filteredOrders = orders
    .filter(o => orderFilter === 'All' || o.status === orderFilter)
    .filter(o => {
      if (!orderSearch.trim()) return true
      const q = orderSearch.toLowerCase()
      return o.customer_name?.toLowerCase().includes(q) || o.customer_phone?.includes(q)
    })

  const filteredProducts = products.filter(p => {
    if (!productSearch.trim()) return true
    const q = productSearch.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row pt-14 lg:pt-16">

      {/* ── SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary-dark text-white min-h-screen fixed left-0 top-16 pt-6 pb-8 px-4 z-40">
        <div className="mb-8 px-2">
          <p className="text-green-300 text-xs font-semibold uppercase tracking-widest">🌿 PCP Admin</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: '📊' },
            { key: 'orders',    label: `Orders (${orders.length})`, icon: '📦' },
            { key: 'products',  label: 'Products',  icon: '🌿' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                tab === item.key ? 'bg-white/20 text-white' : 'text-green-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-green-300 hover:text-white hover:bg-white/10 transition-colors">
          🚪 Sign Out
        </button>
      </aside>

      {/* Mobile tab bar */}
      <div className="lg:hidden flex gap-2 px-4 pt-4 pb-2 bg-white shadow-sm sticky top-14 z-30">
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'orders',    label: 'Orders'    },
          { key: 'products',  label: 'Products'  },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
              tab === item.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {item.label}
          </button>
        ))}
        <button onClick={logout} className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600">
          Out
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-64 px-4 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-4xl mb-3">🌿</p>
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          </div>
        ) : (

          <>
            {/* ── DASHBOARD TAB ── */}
            {tab === 'dashboard' && (
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-8">
                  {[
                    { label: 'Total Orders', value: orders.length,    icon: '📦', color: 'border-l-blue-400'   },
                    { label: 'Pending',      value: pending,          icon: '⏳', color: 'border-l-yellow-400' },
                    { label: 'Delivered',    value: delivered,        icon: '✅', color: 'border-l-green-400'  },
                    { label: 'Revenue',      value: `Rs ${revenue.toLocaleString()}`, icon: '💰', color: 'border-l-purple-400' },
                    { label: 'Products',     value: products.length,  icon: '🌿', color: 'border-l-primary'    },
                  ].map(s => (
                    <div key={s.label} className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${s.color}`}>
                      <p className="text-2xl mb-1">{s.icon}</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-800">{s.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-800">Recent Orders</h2>
                    <button onClick={() => setTab('orders')} className="text-xs text-primary font-semibold">View all →</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-primary-dark text-white">
                        <tr>
                          {['#', 'Customer', 'Phone', 'Items', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {orders.slice(0, 5).map((o, i) => (
                          <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                            <td className="px-4 py-3 font-medium text-gray-800">{o.customer_name}</td>
                            <td className="px-4 py-3 text-gray-500">{o.customer_phone}</td>
                            <td className="px-4 py-3 text-gray-500">{o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''}</td>
                            <td className="px-4 py-3 font-semibold">Rs {Number(o.total).toLocaleString()}</td>
                            <td className="px-4 py-3 text-gray-500 uppercase text-xs">{o.payment_method}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[o.status]}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Orders ({orders.length})</h1>
                </div>

                {/* Search */}
                <div className="relative mb-4 max-w-sm">
                  <input
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    placeholder="Search by customer name or phone..."
                    className="w-full border border-gray-200 rounded-full pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary bg-white"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Filter */}
                {/* <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1"></div> */}

                {/* Filter */}
                <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
                  {['All', 'Pending', 'Confirmed', 'Delivered', 'Cancelled'].map(f => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        orderFilter === f
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
                      }`}
                    >
                      {f} {f !== 'All' && `(${orders.filter(o => o.status === f).length})`}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                      No {orderFilter !== 'All' ? orderFilter.toLowerCase() : ''} orders{orderSearch ? ` matching "${orderSearch}"` : ''}
                    </div>
                  )}
                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      {/* Order header — always visible */}
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{order.customer_name}</p>
                            <p className="text-xs text-gray-400">{order.customer_phone} · {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-gray-800 text-sm">Rs {Number(order.total).toLocaleString()}</p>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status]}`}>
                            {order.status}
                          </span>
                          <span className="text-gray-400 text-sm">{expandedOrder === order.id ? '▲' : '▼'}</span>
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {expandedOrder === order.id && (
                        <div className="border-t border-gray-100 px-5 py-4">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-[10px] text-primary font-bold uppercase tracking-wide mb-1">Customer</p>
                              <p className="text-sm text-gray-700">{order.customer_name}</p>
                              <p className="text-sm text-gray-500">{order.customer_phone}</p>
                              {order.customer_email && <p className="text-xs text-gray-400">{order.customer_email}</p>}
                            </div>
                            <div>
                              <p className="text-[10px] text-primary font-bold uppercase tracking-wide mb-1">Delivery</p>
                              <p className="text-sm text-gray-700">{order.customer_address}</p>
                              {order.customer_city && <p className="text-sm text-gray-500">{order.customer_city}</p>}
                            </div>
                            <div>
                              <p className="text-[10px] text-primary font-bold uppercase tracking-wide mb-1">Payment</p>
                              <p className="text-sm text-gray-700">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                              <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-primary font-bold uppercase tracking-wide mb-1">Update Status</p>
                              <select
                                value={order.status}
                                onChange={e => handleStatus(order.id, e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary bg-white"
                              >
                                {['Pending', 'Confirmed', 'Delivered', 'Cancelled'].map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Items */}
                          <div className="border-t border-gray-100 pt-3 mb-3">
                            <p className="text-[10px] text-primary font-bold uppercase tracking-wide mb-2">Items</p>
                            <div className="flex flex-col gap-2">
                              {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                      {item.product_id && products.find(p => p.id === item.product_id)?.images?.[0] ? (
                                        <img src={`/images/${products.find(p => p.id === item.product_id).images[0]}`} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-700">{item.product_name} ×{item.quantity}</p>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-800">Rs {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Totals + delete */}
                          <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                            <div className="text-xs text-gray-500 space-y-0.5">
                              <p>Subtotal: Rs {Number(order.subtotal).toLocaleString()}</p>
                              <p>Shipping: Rs {Number(order.shipping).toLocaleString()}</p>
                              <p className="font-bold text-gray-800 text-sm">Total: Rs {Number(order.total).toLocaleString()}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── PRODUCTS TAB ── */}
            {tab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Products ({products.length})</h1>
                  <button
                    onClick={openAdd}
                    className="bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2"
                  >
                    + Add Product
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-5 max-w-sm">
                  <input
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search by product name or category..."
                    className="w-full border border-gray-200 rounded-full pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary bg-white"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Products table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-primary-dark text-white">
                        <tr>
                          {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredProducts.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                              No products matching "{productSearch}"
                            </td>
                          </tr>
                        )}
                        {filteredProducts.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                                {p.images?.[0] ? (
                                  <img src={`/images/${p.images[0]}`} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px]">
                              <p className="truncate">{p.name}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{p.category}</span>
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-800">Rs {Number(p.price).toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {p.in_stock ? `✓ ${p.stock_qty}` : '✗ Out'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-lg">{p.featured ? '⭐' : '—'}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEdit(p)}
                                  className="text-xs font-semibold text-primary border border-primary px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-1"
                                >
                                  ✏ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="text-xs font-semibold text-red-400 border border-red-200 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  🗑
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── ADD / EDIT PRODUCT MODAL ── */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="px-6 py-5 flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Product Name *</label>
                <input
                  value={productForm.name}
                  onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Money Plant"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Price (Rs) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="500"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary bg-white"
                  >
                    {['plants', 'pots', 'tools', 'fertilizers', 'seeds'].map(c => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short description of the product..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Images */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Image filenames</label>
                <input
                  value={productForm.images}
                  onChange={e => setProductForm(f => ({ ...f, images: e.target.value }))}
                  placeholder="27.jpeg, 12.webp (comma separated)"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                <p className="text-[10px] text-gray-400 mt-1">Enter filenames from your public/images/ folder</p>
              </div>

              {/* Colors */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Colors (hex)</label>
                <input
                  value={productForm.colors}
                  onChange={e => setProductForm(f => ({ ...f, colors: e.target.value }))}
                  placeholder="#c0392b, #2980b9 (comma separated)"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Stock + Featured */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stockQty}
                    onChange={e => setProductForm(f => ({ ...f, stockQty: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={e => setProductForm(f => ({ ...f, inStock: e.target.checked }))}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-gray-700">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={e => setProductForm(f => ({ ...f, featured: e.target.checked }))}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-gray-700">⭐ Featured</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors text-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
