import SpotifyProvider from 'next-auth/providers/spotify';
import { NextAuth, NextAuthOptions, TokenSet } from '@/common/auth/client';
import { getAccessToken } from '@/services/spotify/spotify.services';

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID!,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
		}),
	],
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				return {
					access_token: account.access_token,
					expires_at: Math.floor(Date.now() / 1000 + account.expires_at!),
					refresh_token: account.refresh_token,
				};
			} else if (
				typeof token.expires_at === 'number' &&
				Date.now() < token.expires_at * 1000
			) {
				return token;
			} else {
				try {
					const tokens: TokenSet = await getAccessToken(
						token.refresh_token as string,
					);

					return {
						...token,
						access_token: tokens.access_token,
						expires_at: Math.floor(
							Date.now() / 1000 + (tokens.expires_at || 0),
						),

						refresh_token: tokens.refresh_token ?? token.refresh_token,
					};
				} catch (error) {
					console.error('Error refreshing access token', error);
					return { ...token, error: 'RefreshAccessTokenError' as const };
				}
			}
		},
		async session({ session, user, token }) {
			if (user) {
				session.user = user;
			}
			session.access_token = token.access_token;
			return session;
		},
	},
};
export default NextAuth(authOptions);
