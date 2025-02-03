import type { NextConfig } from "next";
import { hostname } from "os";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    turbo: {},
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "sellarts.nyc3.cdn.digitaloceanspaces.com",
      },
      {
        hostname: "ui-avatars.com",
      },
      {
        hostname: "placehold.co",
      },
      {
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        hostname: "192.168.1.2",
      },
      {
        hostname: "s3.oswinjerome.in",
      },
      {
        hostname: "art.s3.oswinjerome.in",
      },
      {
       hostname: "127.0.0.1",
     },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
