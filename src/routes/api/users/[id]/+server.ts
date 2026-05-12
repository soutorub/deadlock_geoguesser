import { json } from '@sveltejs/kit';
import { updateUserProfile } from '$lib/server/db';

export async function PATCH({ params, request }) {
	const { username, email, bio } = await request.json();

	if (!params.id || !username || !email) {
		return json({ message: 'Username und E-Mail sind erforderlich.' }, { status: 400 });
	}

	try {
		const user = await updateUserProfile(params.id, {
			username: String(username).trim(),
			email: String(email).trim().toLowerCase(),
			bio: String(bio ?? '').trim()
		});

		if (!user) {
			return json({ message: 'User wurde nicht gefunden.' }, { status: 404 });
		}

		return json({ user });
	} catch (error) {
		console.error('Profile update failed:', error);
		return json({ message: 'Profil konnte nicht aktualisiert werden.' }, { status: 500 });
	}
}
