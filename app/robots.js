// Change this to your real domain once you buy one.
const BASE_URL = 'https://pcp-frontend.vercel.app'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/cart'], // keep admin panel and cart out of search results
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
