import { getProducts } from '@/lib/api'
import HomeClient from './HomeClient'

export default async function HomePage() {
  let products = []
  try {
    products = await getProducts()
  } catch (e) {
    // backend might be off during build — graceful fallback
  }

  const featured  = products.filter(p => p.featured)
  const allForMarquee = featured.length >= 4 ? featured : products.slice(0, 8)

  return <HomeClient products={products} marqueeProducts={allForMarquee} />
}
