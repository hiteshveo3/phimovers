/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bundle the icon packages with the app instead of as a separate server
  // vendor chunk. This avoids the Next 14 dev error
  // "Cannot find module './vendor-chunks/@hugeicons.js'" that breaks
  // generateStaticParams / SSR for pages using these client components.
  transpilePackages: ["@hugeicons/react", "@hugeicons/core-free-icons"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.phimovers.co.uk" }],
        destination: "https://phimovers.co.uk/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
