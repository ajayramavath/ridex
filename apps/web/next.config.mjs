/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@ridex/ui"],
  webpack: (config) => {
    config.snapshot = {
      managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
      immutablePaths: []
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ridex-s3-bucket.s3.amazonaws.com",
        port: "",
        pathname: "/**"
      }
    ]
  }
}

export default nextConfig
