import type { NextRequest } from 'next/server'
import { auth0 } from '~/lib/auth0'

export async function middleware(request: NextRequest) {
	const authResponse = await auth0.middleware(request)
	const url = new URL(request.nextUrl)
	const redirectUrl = url.searchParams.get('redirectTo')
	// biome-ignore lint/suspicious/noConsole: <explanation>
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	console.log('🚀 ~ middleware ~ redirectUrl:', redirectUrl)

	if (redirectUrl) {
		authResponse.cookies.set('redirectTo', redirectUrl, {
			path: '/',
			maxAge: 60 * 60 * 24,
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
		})
		// biome-ignore lint/suspicious/noConsole: <explanation>
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log(
			'🚀 ~ middleware ~ cookie:',
			authResponse.cookies.get('redirectTo'),
		)
	}

	// biome-ignore lint/suspicious/noConsole: <explanation>
	// biome-ignore lint/suspicious/noConsoleLog: <explanation>
	console.log(
		'🚀 ~ middleware ~ get cookie:',
		authResponse.cookies.get('redirectTo'),
	)

	return authResponse
}

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
}
