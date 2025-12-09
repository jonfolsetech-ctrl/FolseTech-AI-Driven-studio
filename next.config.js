/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true, // Required for static export if needed
  },
  // Optimize for production
  swcMinify: true,
  // Output configuration for Amplify
  output: 'standalone',
  // Environment variables that should be exposed to the browser
  env: {
    // Add any public env vars here
  },
}

module.exports = nextConfig
