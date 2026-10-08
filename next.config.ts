import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },

  // The CV used to live at a single path; keep old links (LinkedIn, emails) working.
  async redirects() {
    return [{ source: "/cv/Nezha-Soumer-CV.pdf", destination: "/cv/Nezha-Soumer-EN.pdf", permanent: false }];
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@react-three/drei",
    ],

    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
};

export default nextConfig;