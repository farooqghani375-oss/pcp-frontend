import { Suspense } from 'react'
import { getProducts } from '@/lib/api'
import ShopClient from './ShopClient'

export default async function ShopPage() {
  let products = []
  try { products = await getProducts() } catch (e) {}
  return (
    <Suspense fallback={<div className="pt-20 text-center text-gray-400">Loading...</div>}>
      <ShopClient products={products} />
    </Suspense>
  )
}