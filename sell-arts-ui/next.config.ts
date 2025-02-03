import type { NextConfig } from "next";
import { hostname } from "os";
import createNextIntlPlugin from "next-intl/plugin";
import { NEXTAUTH_URL, NEXT_PUBLIC_SITE_URL} from "./secret";
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: '',
  env: {
    NEXTAUTH_URL: NEXTAUTH_URL,
    NEXT_PUBLIC_SITE_URL: NEXT_PUBLIC_SITE_URL,
  },
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
