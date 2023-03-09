import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { SpotifyServices } from '../services/spotify/spotify.services';

export default function Component() {
	const { data: session } = useSession();
	const [userInfo, setUserInfo] = useState<any>({});

	const getUserInfo = async () => {
		try {
			const response = await SpotifyServices.getUserInfo();
			if (response?.status === 200) {
				console.log('Resp:', response.data);
				setUserInfo(response.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (session) getUserInfo();
	}, [session]);

	if (session) {
		return (
			<>
				{userInfo.email && <h1>Bienvenido {userInfo.display_name}</h1>}
				Signed in as {session?.user?.email} <br />
				<button onClick={() => signOut()}>Sign out</button>
			</>
		);
	}
	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign in</button>
		</>
	);
}
