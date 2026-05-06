import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost:3000'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'perfume-ecommerce-production.up.railway.app',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'https://lelabo.ips.photos'
      },
    ],
  },
};

export default nextConfig;