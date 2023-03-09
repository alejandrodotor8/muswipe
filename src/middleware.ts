import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): NextResponse | void {
	/* let verify = request.cookies.get('SPOTIFY_TOKEN');
	let url = request.url;

	if (!verify && !url.includes('/login')) {
		return NextResponse.redirect(new URL('/login', url));
	}

	if (verify && url.includes('/login')) {
		return NextResponse.redirect(new URL('/', url));
	} */
}

export const config = {
	matcher: ['/', '/login'],
};
