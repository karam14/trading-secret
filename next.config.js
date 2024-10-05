/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable:false,
   register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
});

const nextConfig = {
  images: {
    domains: ['utfs.io', 'hxxwdvxsyzoemhdmcrqc.supabase.co'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
      allowedForwardedHosts: ["localhost:3000"],
    }
  }
};

module.exports = withPWA(nextConfig);
