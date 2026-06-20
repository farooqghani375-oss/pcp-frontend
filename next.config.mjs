/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from your backend and any external sources
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
}

export default nextConfig
