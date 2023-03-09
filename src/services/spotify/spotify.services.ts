import spotifyInstance from './spotify.instance';
import { BASIC_INFO_ENDPOINT } from '@/constants/spotify-api-endpoints';

export class SpotifyServices {
	static getUserInfo() {
		return spotifyInstance.get(BASIC_INFO_ENDPOINT);
	}
}
