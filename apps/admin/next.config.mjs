/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@iconic/db"],
  outputFileTracingRoot: new URL("../../", import.meta.url).pathname,
}

export default nextConfig
