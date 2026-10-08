import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // A parent-directory lockfile must not make Turbopack treat the entire
    // user directory as this app's workspace.
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
