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
  // Host redirects are handled in Vercel (apex → www). Do not add www↔apex
  // redirects here — they fight Vercel and can create a loop.
};

export default nextConfig;
