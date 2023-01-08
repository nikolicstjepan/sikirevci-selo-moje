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
        hostname: "eu2.contabostorage.com",
      },
    ],
  },
  i18n: {
    locales: ["hr"],
    defaultLocale: "hr",
  },
};

module.exports = nextConfig;
