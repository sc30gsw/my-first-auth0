import { Auth0Client } from '@auth0/nextjs-auth0/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const auth0 = new Auth0Client({
	onCallback: async (error) => {
		if (error) {
			return NextResponse.json(
				{ message: 'Authentication failed' },
				{ status: 401 },
			)
		}

		const cookiesStore = await cookies()

		const redirectTo = cookiesStore.get('redirectTo')?.value ?? ''

		const response = redirectTo
			? NextResponse.redirect(redirectTo)
			: NextResponse.redirect(process.env.APP_BASE_URL ?? '')

		response.cookies.delete('redirectTo')

		return response
	},
})
