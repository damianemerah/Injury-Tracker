/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    });
    return config;
  },
  env: {
    mongodburl:
      "mongodb+srv://damian:j1rXuar2oOelXuXk@cluster0.joujjoq.mongodb.net/painPoint?retryWrites=true&w=majority",
  },
  generateEtags: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.gravatar.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
