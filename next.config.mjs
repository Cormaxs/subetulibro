/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/thumbnail**',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        port: '',
        pathname: '/books/content**',
      },
      {
        protocol: 'https',
        hostname: 'cfluna.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'assets.lectulandia.co',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
