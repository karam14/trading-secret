/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {

        domains: ['utfs.io','hxxwdvxsyzoemhdmcrqc.supabase.co'],
    },
    experimental: {
        serverActions: {
          allowedOrigins: ["localhost:3000"],
           allowedForwardedHosts: ["localhost:3000"],
          // ^ You might have to use this property depending on your exact version.
        }
      }
};

module.exports = nextConfig;
