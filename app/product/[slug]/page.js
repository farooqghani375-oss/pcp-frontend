import { getProduct } from '@/lib/api'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductDetailPage({ params }) {
  let product = null
  try { product = await getProduct(params.slug) } catch (e) {}
  if (!product) return <div className="pt-20 text-center text-gray-400">Product not found.</div>
  return <ProductDetailClient product={product} />
}
