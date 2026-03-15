import { NextRequest, NextResponse } from 'next/server';

// Бэкенд — единый API сервер
// В production и development используется одна и та же переменная
const API_DESTINATION = process.env.API_DESTINATION || 'https://api.xn--24-mlcu7d.xn--p1ai';

/**
 * Модифицирует Set-Cookie header чтобы cookies работали на localhost
 * Убирает Domain, Secure (для HTTP), меняет SameSite на Lax
 */
function rewriteSetCookie(cookie: string): string {
    return cookie
        // Убираем Domain чтобы cookie сохранилась для текущего хоста
        .replace(/;\s*Domain=[^;]*/gi, '')
        // Убираем Secure т.к. localhost это HTTP
        .replace(/;\s*Secure/gi, '')
        // Меняем SameSite=None на Lax (None требует Secure)
        .replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
        // Принудительно ставим Path=/ — иначе cookie может быть привязана
        // к пути эндпоинта (/api/auth) и не отправляться на /api/users/*
        .replace(/;\s*Path=[^;]*/gi, '')
        + '; Path=/';
}

async function proxyRequest(request: NextRequest, path: string[]) {
    // Формируем URL с query параметрами
    const searchParams = request.nextUrl.searchParams.toString();
    const apiPath = `/api/${path.join('/')}`;
    const url = `${API_DESTINATION}${apiPath}${searchParams ? `?${searchParams}` : ''}`;

    console.log('PROXY:', request.method, apiPath, '->', url);

    // Копируем важные заголовки
    const headers = new Headers();
    const headersToForward = [
        'content-type',
        'cookie',
        'x-csrf-token',
        'x-xsrf-token',
        'authorization',
        'accept',
    ];

    headersToForward.forEach(header => {
        const value = request.headers.get(header);
        if (value) {
            headers.set(header, value);
        }
    });

    // Логируем cookies для отладки
    const cookies = request.headers.get('cookie');
    if (cookies) {
        console.log('PROXY cookies:', cookies.substring(0, 100) + (cookies.length > 100 ? '...' : ''));
    } else {
        console.log('PROXY: No cookies in request');
    }

    // Получаем тело запроса для не-GET методов
    let body: string | null = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        try {
            body = await request.text();
        } catch {
            // Нет тела
        }
    }

    try {
        const response = await fetch(url, {
            method: request.method,
            headers,
            body,
        });

        // Копируем ответ
        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            // Пропускаем заголовки, которые Next.js устанавливает сам
            if (['content-encoding', 'transfer-encoding'].includes(lowerKey)) {
                return;
            }
            // Set-Cookie обрабатываем отдельно
            if (lowerKey === 'set-cookie') {
                return;
            }
            responseHeaders.set(key, value);
        });

        // Обрабатываем Set-Cookie headers — переписываем для localhost
        const setCookieHeaders = response.headers.getSetCookie?.() || [];
        setCookieHeaders.forEach(cookie => {
            const rewritten = rewriteSetCookie(cookie);
            console.log('PROXY Set-Cookie rewritten:', rewritten.substring(0, 80) + '...');
            responseHeaders.append('Set-Cookie', rewritten);
        });

        const data = await response.arrayBuffer();

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Proxy error', message: String(error) },
            { status: 502 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return proxyRequest(request, path);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return proxyRequest(request, path);
}
