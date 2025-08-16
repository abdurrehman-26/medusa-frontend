import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      new URL('https://medusa-public-images.s3.eu-west-1.amazonaws.com/**'),
      new URL('http://localhost:9000/static/**')
    ],
  },
}

export default nextConfig;
