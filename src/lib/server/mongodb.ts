import { MongoClient } from 'mongodb';
import { env } from '$env/dynamic/private';

let client: MongoClient | null = null;
let connected = false;
const clientOptions = {
	serverSelectionTimeoutMS: 5000,
	connectTimeoutMS: 5000,
	maxPoolSize: 5
} as ConstructorParameters<typeof MongoClient>[1];

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
		client = new MongoClient(mongoUri, clientOptions);
	}

	if (!connected) {
		await client.connect();
		connected = true;
	}

	return client.db(databaseName);
}
