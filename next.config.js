/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn-icons-png.flaticon.com',
      'images.unsplash.com',
      'res.cloudinary.com',
      'ph-files.imgix.net',
      'www.leptidigital.fr',
      'www.google.com',
      'nocohub-001-prod-app-attachments.s3.us-east-2.amazonaws.com',
      'media.istockphoto.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nocohub-001-prod-app-attachments.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/nc/uploads/**',
      }
    ],
  },
}

module.exports = nextConfig 