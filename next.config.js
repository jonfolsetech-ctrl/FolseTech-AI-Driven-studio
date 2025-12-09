/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Optimize for production
  swcMinify: true,
  // Environment variables that should be exposed to the browser
  env: {
    // Add any public env vars here
  },
}

module.exports = nextConfig
