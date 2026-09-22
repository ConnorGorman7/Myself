import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Client pitch demos are self-contained static HTML in public/demo/*.
  // Rewrite the extensionless /demo/<name> URL to the underlying .html file
  // so they share the same clean URL shape as the React demos (e.g. /demo/mpnails).
  async rewrites() {
    return [
      { source: "/demo/soussansbarber", destination: "/demo/soussansbarber.html" },
      { source: "/demo/totallook", destination: "/demo/totallook.html" },
    ];
  },
};

export default nextConfig;
