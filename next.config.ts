import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.figma.com" },
      { protocol: "https", hostname: "b2bmarkt.co.il" },
      { protocol: "https", hostname: "polarizedx.co.il" }
    ]
  }
};

export default nextConfig;
