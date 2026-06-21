import { getProducts } from '@/lib/api'

// Change this to your real domain once you buy one.
// Until then, this is your Vercel URL.
const BASE_URL = 'https://pcp-frontend.vercel.app'

export default async function sitemap() {
  const staticPages = [
    { url: `${BASE_URL}/`,        changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/shop`,    changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/about`,   changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Pull every product so Google can find and index each one individually
  let productPages = []
  try {
    const products = await getProducts()
    productPages = products.map(p => ({
      url: `${BASE_URL}/product/${p.id}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  } catch (e) {
    // If the backend is briefly down during a build, don't fail the whole sitemap
  }

  return [...staticPages, ...productPages]
}
