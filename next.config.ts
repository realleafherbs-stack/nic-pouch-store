import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.figma.com" },
      { protocol: "https", hostname: "b2bmarkt.co.il" },
      { protocol: "https", hostname: "polarizedx.co.il" },
      { protocol: "https", hostname: "**.ducks.co.il" },
      { protocol: "https", hostname: "app.payper.co.il" }
    ]
  }
};

export default nextConfig;
