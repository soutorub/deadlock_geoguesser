import { json } from '@sveltejs/kit';
import { getCollections, buildBootstrap } from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';

function avatarFromUsername(username: string) {
	return (
		username
			.split(' ')
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('')
			.slice(0, 2) || 'DG'
	);
}

export async function POST({ request }) {
	const { email, password, username } = await request.json();
	const normalizedEmail = String(email ?? '').trim().toLowerCase();
	const normalizedUsername = String(username ?? '').trim();
	const normalizedPassword = String(password ?? '');

	if (!normalizedEmail || !normalizedUsername || normalizedPassword.length < 6) {
		return json({ message: 'Bitte fuelle alle Felder korrekt aus.' }, { status: 400 });
	}

	const { users } = await getCollections();
	const existing = await users.findOne({ email: normalizedEmail });
	if (existing) {
		return json({ message: 'Diese E-Mail ist bereits registriert.' }, { status: 409 });
	}

	const now = new Date();
	const result = await users.insertOne({
		email: normalizedEmail,
		passwordHash: hashPassword(normalizedPassword),
		username: normalizedUsername,
		avatar: avatarFromUsername(normalizedUsername),
		bio: 'Neuer Deadlock-Scout.',
		createdAt: now,
		updatedAt: now
	});

	const payload = await buildBootstrap(result.insertedId.toString());
	return json(payload, { status: 201 });
}
