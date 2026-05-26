/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@odin/storage", "@odin/core"],
  // Required for Puppeteer/Chromium to work in Vercel serverless
  serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core", "puppeteer", "handlebars"],
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? '/api/v1' 
          : 'http://localhost:3001/api/v1/:path*',
      },
      {
        source: '/webhooks/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? '/api/index' 
          : 'http://localhost:3001/webhooks/:path*',
      }
    ]
  },
};


module.exports = nextConfig;
