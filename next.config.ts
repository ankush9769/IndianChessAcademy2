const nextConfig = {
  experimental: {
    // Ensure Next.js traces files relative to this workspace root
    outputFileTracingRoot: process.cwd(),
  },
};

export default nextConfig;
