/** @type {import('next').NextConfig} */
const nextConfig = {
    // Output configuration for Vercel
    output: 'standalone',

    // Environment variables
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
        NEXT_PUBLIC_APP_NAME: 'ResearchSentinel',
    },

    // Image optimization
    images: {
        domains: ['localhost'],
        unoptimized: false,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

    // Security headers
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                ],
            },
        ];
    },

    // Webpack configuration
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        return config;
    },

    // Experimental features
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },

    // Production optimizations
    swcMinify: true,
    compress: true,
    poweredByHeader: false,

    // Redirect configuration
    async redirects() {
        return [];
    },

    // Rewrites for API proxy (optional)
    async rewrites() {
        return [];
    },
};

export default nextConfig;
