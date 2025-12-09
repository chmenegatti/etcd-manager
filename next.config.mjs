/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Avoid bundling etcd3 so its proto files resolve from node_modules at runtime
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('etcd3');
    }
    return config;
  },
};

export default nextConfig;
