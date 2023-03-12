import { signOut, useSession } from '@/common/auth/client';

export default function Component() {
	const { data: session } = useSession();
	if (!session) {
		return null;
	}

	return (
		<>
			<h1>Perfil</h1>
			<p>Signed in as {session?.user?.email}</p>

			<button onClick={() => signOut()}>Sign out</button>
		</>
	);
}

Component.auth = {
	role: 'user',
	loading: <h1>Loading...</h1>,
	unauthorized: '/api/auth/login',
};
