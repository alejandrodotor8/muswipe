import axios from 'axios';
import spotifyInstance from './spotify.instance';
import {
	BASIC_INFO_ENDPOINT,
	TOKEN_ENDPOINT,
} from '@/constants/spotify-api-endpoints';

export class SpotifyServices {
	static getUserInfo() {
		return spotifyInstance.get(BASIC_INFO_ENDPOINT);
	}
}

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

export const getAccessToken = async (refresh_token: string) => {
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
