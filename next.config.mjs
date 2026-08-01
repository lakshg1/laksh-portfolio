/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep the libSQL client out of the webpack bundle — bundling it breaks its
  // node/native resolution and remote (Turso) connections fail with opaque
  // "fetch failed" errors. Externalized, it loads via normal require().
  serverExternalPackages: ['@libsql/client', 'libsql'],
  // The site is fully static, so it exports cleanly to any host.
  // Uncomment the next line only if you deploy to GitHub Pages instead of Vercel.
  // output: 'export',
};

export default nextConfig;
