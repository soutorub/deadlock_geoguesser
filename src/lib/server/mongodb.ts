import { MongoClient } from 'mongodb';
import { MONGODB_DB_NAME, MONGODB_URI } from '$env/static/private';

const client = new MongoClient(MONGODB_URI);
let connected = false;

export async function getDatabase() {
	if (!connected) {
		await client.connect();
		connected = true;
	}

	return client.db(MONGODB_DB_NAME || 'deadlock_geoguesser');
}
