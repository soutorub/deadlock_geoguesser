import { json } from '@sveltejs/kit';
import { getDatabase } from '$lib/server/mongodb';

export async function GET() {
	try {
		const db = await getDatabase();
		await db.command({ ping: 1 });

		return json({
			ok: true,
			message: 'MongoDB connection successful'
		});
	} catch (error) {
		console.error('MongoDB health check failed:', error);
		const details = error instanceof Error ? error.message : 'Unbekannter Fehler';

		return json(
			{
				ok: false,
				message: 'MongoDB connection failed',
				details
			},
			{ status: 500 }
		);
	}
}
