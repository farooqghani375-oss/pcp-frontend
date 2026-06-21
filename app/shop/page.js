import { Suspense } from 'react'
import { getProducts } from '@/lib/api'
import ShopClient from './ShopClient'

export const metadata = {
  title: 'Shop All Products',
  description: 'Browse our full collection of plants, pots, fertilizers, and gardening tools. Fast delivery across Peshawar.',
}

export default async function ShopPage() {
  let products = []
  try { products = await getProducts() } catch (e) {}
  return (
    <Suspense fallback={<div className="pt-20 text-center text-gray-400">Loading...</div>}>
      <ShopClient products={products} />
    </Suspense>
  )
}
