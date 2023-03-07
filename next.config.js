/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.contabostorage.com",
      },
    ],
  },
  i18n: {
    locales: ["hr"],
    defaultLocale: "hr",
  },
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
