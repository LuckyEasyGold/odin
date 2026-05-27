/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@odin/storage", "@odin/core", "@odin/engine"],
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/:path*`
          : 'http://localhost:3001/api/v1/:path*',
      },
      {
        source: '/webhooks/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/webhooks/:path*`
          : 'http://localhost:3001/webhooks/:path*',
      }
    ]
  },
};


module.exports = nextConfig;
