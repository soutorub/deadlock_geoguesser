import { json } from '@sveltejs/kit';
import { buildBootstrap } from '$lib/server/db';

export async function GET({ url }) {
	const userId = url.searchParams.get('userId');

	if (!userId) {
		return json({
			currentUser: null,
			profileScores: [],
			leaderboardScores: []
		});
	}

	try {
		const payload = await buildBootstrap(userId);
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
