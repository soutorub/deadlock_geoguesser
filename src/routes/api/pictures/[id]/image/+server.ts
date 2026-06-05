import { error } from '@sveltejs/kit';
import { getPictureDocumentById } from '$lib/server/db';

export async function GET({ params }) {
	const picture = await getPictureDocumentById(params.id);

	if (!picture) {
		throw error(404, 'Bild nicht gefunden.');
	}

	return new Response(new Uint8Array(picture.image.buffer), {
		headers: {
			'content-type': picture.mimeType,
			'cache-control': 'public, max-age=31536000, immutable'
		}
	});
}
