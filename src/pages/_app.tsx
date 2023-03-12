import React from 'react';
import type { AppProps } from 'next/app';
import '@/styles/globals.scss';
import { SessionProvider, useSession } from 'next-auth/react';

export default function MyApp({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {
	return (
		<SessionProvider session={session}>
			{Component.auth ? (
				<Auth>
					<Component {...pageProps} />
				</Auth>
			) : (
				<Component {...pageProps} />
			)}
		</SessionProvider>
	);
}

function Auth({ children }) {
	const { status } = useSession({ required: true });

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	return children;
}
