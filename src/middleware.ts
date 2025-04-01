import { type NextRequest, NextResponse } from 'next/server'
import { auth0 } from '~/lib/auth0'

export async function middleware(request: NextRequest) {
	const authResponse = await auth0.middleware(request)

	const session = authResponse.cookies.get('__session')

	if (session?.value) {
		const url = new URL(request.nextUrl)
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log(
			'🚀 ~ middleware ~ url:',
			url,
			request.nextUrl,
			request.nextUrl.searchParams.get('redirectTo'),
		)
		const redirectUrl = request.nextUrl.searchParams.get('redirectTo')
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log('🚀 ~ middleware ~ redirectUrl:', redirectUrl)

		if (!redirectUrl) {
			return authResponse
		}

		try {
			return NextResponse.redirect(redirectUrl)
		} catch (err: unknown) {
			if (err instanceof Error) {
				// biome-ignore lint/suspicious/noConsoleLog: <explanation>
				// biome-ignore lint/suspicious/noConsole: <explanation>
				console.log('🚀 ~ middleware ~ err:', err, err.message)
			}
			return authResponse
		}
	}

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
