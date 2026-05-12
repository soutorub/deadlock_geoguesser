import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

let client: MongoClient | null = null;
let connected = false;

export async function getDatabase() {
	const mongoUri = env.MONGODB_URI;
	const databaseName = env.MONGODB_DB_NAME;

	if (!mongoUri) {
		throw new Error('MONGODB_URI is not configured');
	}

	if (!databaseName) {
		throw new Error('MONGODB_DB_NAME is not configured');
	}

	if (!client) {
		client = new MongoClient(mongoUri);
	}

	if (!connected) {
		await client.connect();
		connected = true;
	}

	return client.db(databaseName);
}
