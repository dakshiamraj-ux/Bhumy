import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bhumy - Smart Waste, Clean Earth',
    short_name: 'Bhumy',
    description: 'Bhumy is an AI-powered circular waste management platform designed to help you build a sustainable future.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4caf50',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
  }
}