import { json } from '@sveltejs/kit';
import { getRandomPictures } from '$lib/server/db';

export async function GET({ url }) {
	const count = Number(url.searchParams.get('count') ?? 5);
	const safeCount = Number.isFinite(count) ? Math.min(30, Math.max(1, count)) : 5;

	try {
		const pictures = await getRandomPictures(safeCount);
		return json({ pictures });
	} catch (error) {
		console.error('Random picture fetch failed:', error);
		return json({ message: 'Bilder konnten nicht geladen werden.' }, { status: 500 });
	}
}
