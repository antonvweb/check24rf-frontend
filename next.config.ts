import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
    turbopack: {},

    // Детальное логирование в dev режиме
    ...(isDev && {
        logging: {
            fetches: {
                fullUrl: true,
                hmrRefreshes: true,
            },
        },
    }),

    productionBrowserSourceMaps: false,
    reactStrictMode: true,

    eslint: {
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: false,
    },

    // Прокси реализован через API Route Handler: src/app/api/[...path]/route.ts
    // Это позволяет правильно передавать cookies между доменами
    // Rewrites НЕ нужны — все /api/* запросы обрабатываются route handler

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://smartcaptcha.yandexcloud.net",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: blob: https:",
                            "font-src 'self' data:",
                            "connect-src 'self' https://api.xn--24-mlcu7d.xn--p1ai wss://api.xn--24-mlcu7d.xn--p1ai",
                            "frame-src 'self' https://smartcaptcha.yandexcloud.net",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "frame-ancestors 'self'",
                            "upgrade-insecure-requests",
                        ].join('; '),
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=31536000; includeSubDomains; preload',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: [
                            'camera=()',
                            'microphone=()',
                            'geolocation=()',
                            'interest-cohort=()',
                            'payment=()',
                            'usb=()',
                        ].join(', '),
                    },
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
