import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      new URL('https://medusa-public-images.s3.eu-west-1.amazonaws.com/**'),
      new URL('http://192.168.0.250:9001/medusa-store/**'),
      new URL('https://res.cloudinary.com/**')
    ],
  },
}

export default nextConfig;
