import axios from 'axios';
import NextAuth, { NextAuthOptions, TokenSet } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { TOKEN_ENDPOINT } from '@/constants/spotify-api-endpoints';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const getAccessToken = async (refresh_token: string) => {
	try {
		const response = await axios.post(
			TOKEN_ENDPOINT,
			{
				grant_type: 'refresh_token',
				refresh_token,
			},
			{
				headers: {
					Authorization: `Basic ${basic}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			},
		);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export const authOptions: NextAuthOptions = {
	providers: [
		SpotifyProvider({
			clientId: client_id!,
			clientSecret: client_secret!,
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
