
export const dynamic = 'force-static';

export function GET() {
  const manifest = {
    name: "Bhumy",
    short_name: "Bhumy",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#008000",
    description: "AI-powered circular waste management app",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
