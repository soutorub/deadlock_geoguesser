import { json } from '@sveltejs/kit';
import { listPictures } from '$lib/server/db';

export async function GET() {
	try {
		const pictures = await listPictures();
		return json({ pictures });
	} catch (error) {
		console.error('Picture list fetch failed:', error);
		return json({ message: 'Bilder konnten nicht geladen werden.' }, { status: 500 });
	}
}
