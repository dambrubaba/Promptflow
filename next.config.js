/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable image optimization to prevent issues with Vercel deployment
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig