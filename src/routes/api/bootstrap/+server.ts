import { json } from '@sveltejs/kit';
import { buildBootstrap } from '$lib/server/db';
import type { BootstrapPayload } from '$lib/types';

export async function GET({ url }) {
	const userId = url.searchParams.get('userId');

	if (!userId) {
		return json({
			currentUser: null,
			profileScores: [],
			leaderboardScores: []
		} satisfies BootstrapPayload);
	}

	try {
		const payload: BootstrapPayload = await buildBootstrap(userId);
		return json(payload);
	} catch (error) {
		console.error('Bootstrap load failed:', error);
		return json(
			{
				message: 'Bootstrap konnte nicht geladen werden.'
			},
			{ status: 500 }
		);
	}
}
