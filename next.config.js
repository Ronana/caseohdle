/** @type {import('next').NextConfig} */
const config = {
  // JSON imports are handled via resolveJsonModule in tsconfig

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent the page from being iframed (clickjacking)
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Limit referrer info sent to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features we don't use
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Basic CSP: only load assets from our own origin + Steam CDN for thumbnails
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js requires unsafe-inline for its injected scripts/styles
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              // Steam capsule images; data:/blob: for canvas share image
              "img-src 'self' data: blob: https://cdn.cloudflare.steamstatic.com",
              // Sound clips and quips are served from /public (self)
              "media-src 'self'",
              // API calls only go to ourselves + Vercel KV (handled server-side anyway)
              "connect-src 'self'",
              // No iframes anywhere
              "frame-src 'none'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = config;
