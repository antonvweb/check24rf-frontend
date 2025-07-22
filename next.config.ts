/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
    turbopack: {},
    async redirects() {
        return [
            {
                source: '/(.*)',
                has: [{ type: 'host', value: 'чек24.рф' }],
                destination: 'http://чек24.рф/:path*',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
