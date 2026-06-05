import { json } from '@sveltejs/kit';
import { buildBootstrap, createScore } from '$lib/server/db';
import type { BootstrapPayload } from '$lib/types';

export async function POST({ request }) {
	const { userId, modeKey, roundCount, timerSeconds, rounds } = await request.json();

	if (!userId || !modeKey || !roundCount || !timerSeconds || !Array.isArray(rounds)) {
		return json({ message: 'Unvollständige Score-Daten.' }, { status: 400 });
	}

	try {
		await createScore({
			userId: String(userId),
			modeKey: String(modeKey),
			roundCount: Number(roundCount),
			timerSeconds: Number(timerSeconds),
			rounds
		});
		const bootstrap: BootstrapPayload = await buildBootstrap(String(userId));

		return json(bootstrap);
	} catch (error) {
		console.error('Score save failed:', error);
		return json({ message: 'Score konnte nicht gespeichert werden.' }, { status: 500 });
	}
}
