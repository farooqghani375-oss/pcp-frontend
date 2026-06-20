import { getProducts } from '@/lib/api'
import ShopClient from './ShopClient'

export default async function ShopPage() {
  let products = []
  try { products = await getProducts() } catch (e) {}
  return <ShopClient products={products} />
}
