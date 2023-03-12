import axios from 'axios';
import { getSession } from 'next-auth/react';

const SpotifyApiClient = () => {
	const defaultOptions = {
		baseURL: 'https://api.spotify.com/v1/',
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const instance = axios.create(defaultOptions);

	instance.interceptors.request.use(async request => {
		const session: any = await getSession();
		if (session) {
			request.headers.Authorization = `Bearer ${session?.access_token}`;
		}
		return request;
	});

	instance.interceptors.response.use(
		response => {
			return response;
		},
		error => {
			console.log(`Response error`, error);
		},
	);

	return instance;
};

export default SpotifyApiClient();
