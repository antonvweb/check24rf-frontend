import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isDev = process.env.NODE_ENV === 'development';

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
};

function getMethodColor(method: string): string {
    switch (method) {
        case 'GET':
            return colors.green;
        case 'POST':
            return colors.blue;
        case 'PUT':
        case 'PATCH':
            return colors.yellow;
        case 'DELETE':
            return colors.red;
        default:
            return colors.white;
    }
}

function getStatusColor(status: number): string {
    if (status >= 200 && status < 300) return colors.green;
    if (status >= 300 && status < 400) return colors.cyan;
    if (status >= 400 && status < 500) return colors.yellow;
    if (status >= 500) return colors.red;
    return colors.white;
}

export async function middleware(request: NextRequest) {
    const startTime = Date.now();

    if (!isDev) {
        return NextResponse.next();
    }

    const { pathname, search } = request.nextUrl;
    const method = request.method;
    const url = pathname + search;

    // Игнорируем статические файлы и внутренние запросы Next.js
    if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/static/') ||
        pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)
    ) {
        return NextResponse.next();
    }

    const methodColor = getMethodColor(method);
    console.log(
        `${colors.bright}${colors.cyan}→ ${methodColor}${method.padEnd(7)}${colors.reset} ${colors.dim}${url}${colors.reset}`
    );

    const response = NextResponse.next();

    const duration = Date.now() - startTime;
    const status = response.status;
    const statusColor = getStatusColor(status);

    console.log(
        `${colors.bright}${colors.cyan}← ${statusColor}${status}${colors.reset} ${colors.dim}${url} ${colors.green}[${duration}ms]${colors.reset}`
    );

    console.log('');

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
