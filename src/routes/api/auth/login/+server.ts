import { json } from '@sveltejs/kit';
import { hashPassword } from '$lib/server/auth';
import { buildBootstrap, getCollections } from '$lib/server/db';
import type { BootstrapPayload } from '$lib/types';

export async function POST({ request }) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return json({ message: 'E-Mail und Passwort sind erforderlich.' }, { status: 400 });
	}

	const { users } = await getCollections();
	const user = await users.findOne({
		email: String(email).trim().toLowerCase(),
		passwordHash: hashPassword(String(password))
	});

	if (!user) {
		return json({ message: 'E-Mail oder Passwort stimmt nicht.' }, { status: 401 });
	}

	const payload: BootstrapPayload = await buildBootstrap(user._id.toString());
	return json(payload);
}
