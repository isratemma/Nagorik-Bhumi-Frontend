/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
  },
};

module.exports = nextConfig;
