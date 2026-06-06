import { Binary, ObjectId } from 'mongodb';
import { getDatabase } from '$lib/server/mongodb';
import type {
	BootstrapPayload,
	ModeStats,
	PictureRecord,
	RoundImage,
	RoundResult,
	ScoreEntry,
	UserRecord
} from '$lib/types';

type UserDocument = {
	_id?: ObjectId;
	email: string;
	passwordHash: string;
	username: string;
	avatar: string;
	bio: string;
	createdAt: Date;
	updatedAt: Date;
};

type PictureDocument = {
	_id?: ObjectId;
	name: string;
	image: Binary;
	mimeType: string;
	actual: { x: number; y: number };
	createdAt: Date;
	updatedAt: Date;
};

type ScoreDocument = {
	_id?: ObjectId;
	userId: ObjectId;
	username: string;
	avatar: string;
	modeKey: string;
	roundCount: number;
	timerSeconds: number;
	totalScore: number;
	isTopThreeForUser: boolean;
	playedAt: Date;
	rounds: RoundResult[];
};

function createEmptyStats(): ModeStats {
	return {
		bestScore: 0,
		lastScore: 0,
		averageScore: 0,
		gamesPlayed: 0,
		lastPlayedAt: null
	};
}

function buildAllModeStats() {
	const rounds = [5, 10, 20, 30];
	const timers = [10, 30, 60];

	return Object.fromEntries(
		rounds.flatMap((roundCount) =>
			timers.map((timerSeconds) => [`${roundCount}-${timerSeconds}`, createEmptyStats()])
		)
	);
}

function toUserRecord(document: UserDocument, scores: ScoreEntry[]): UserRecord {
	const modeStats = buildAllModeStats();
	const grouped = new Map<string, ScoreEntry[]>();

	for (const score of scores) {
		const bucket = grouped.get(score.modeKey) ?? [];
		bucket.push(score);
		grouped.set(score.modeKey, bucket);
	}

	for (const [modeKey, modeScores] of grouped.entries()) {
		const sortedByDate = [...modeScores].sort(
			(left, right) => new Date(right.playedAt).getTime() - new Date(left.playedAt).getTime()
		);
		const total = modeScores.reduce((sum, score) => sum + score.totalScore, 0);
		const best = modeScores.reduce((max, score) => Math.max(max, score.totalScore), 0);
		modeStats[modeKey] = {
			bestScore: best,
			lastScore: sortedByDate[0]?.totalScore ?? 0,
			averageScore: modeScores.length ? Math.round(total / modeScores.length) : 0,
			gamesPlayed: modeScores.length,
			lastPlayedAt: sortedByDate[0]?.playedAt ?? null
		};
	}

	return {
		id: document._id?.toString() ?? '',
		email: document.email,
		username: document.username,
		avatar: document.avatar,
		bio: document.bio,
		modeStats
	};
}

function toScoreEntry(document: ScoreDocument): ScoreEntry {
	return {
		id: document._id?.toString() ?? '',
		userId: document.userId?.toString(),
		username: document.username,
		avatar: document.avatar,
		modeKey: document.modeKey,
		roundCount: document.roundCount as 5 | 10 | 20 | 30,
		timerSeconds: document.timerSeconds as 10 | 30 | 60,
		totalScore: document.totalScore,
		isTopThreeForUser: document.isTopThreeForUser,
		playedAt: document.playedAt.toISOString(),
		rounds: document.rounds
	};
}

function toRoundImage(document: PictureDocument): RoundImage {
	const id = document._id?.toString() ?? '';

	return {
		id,
		name: document.name,
		imageUrl: `/api/pictures/${id}/image`,
		actual: document.actual
	};
}

function toPictureRecord(document: PictureDocument): PictureRecord {
	const id = document._id?.toString() ?? '';

	return {
		id,
		name: document.name,
		imageUrl: `/api/pictures/${id}/image`,
		actual: document.actual
	};
}

export async function getCollections() {
	const db = await getDatabase();

	return {
		users: db.collection<UserDocument>('users'),
		pictures: db.collection<PictureDocument>('pictures'),
		scores: db.collection<ScoreDocument>('scores')
	};
}

export async function getUserScores(userId: string) {
	const { scores } = await getCollections();
	const documents = await scores
		.find({ userId: new ObjectId(userId) })
		.sort({ playedAt: -1, totalScore: -1 })
		.toArray();

	return documents.map(toScoreEntry);
}

export async function getLeaderboardScores() {
	const { scores } = await getCollections();
	const documents = await scores
		.find({ isTopThreeForUser: true })
		.sort({ totalScore: -1, playedAt: 1 })
		.toArray();

	return documents.map(toScoreEntry);
}

export async function getUserById(userId: string) {
	const { users } = await getCollections();
	const user = await users.findOne({ _id: new ObjectId(userId) });
	if (!user) {
		return null;
	}

	const scores = await getUserScores(userId);
	return toUserRecord(user, scores);
}

export async function syncTopThreeFlagsForUser(userId: string) {
	const { scores } = await getCollections();
	const objectId = new ObjectId(userId);
	const documents = await scores
		.find({ userId: objectId })
		.sort({ totalScore: -1, playedAt: 1, _id: 1 })
		.toArray();

	const topIds = new Set(documents.slice(0, 3).map((entry) => entry._id.toString()));

	await Promise.all(
		documents.map((document) =>
			scores.updateOne(
				{ _id: document._id },
				{ $set: { isTopThreeForUser: topIds.has(document._id.toString()) } }
			)
		)
	);
}

export async function createScore(input: {
	userId: string;
	modeKey: string;
	roundCount: number;
	timerSeconds: number;
	rounds: RoundResult[];
}) {
	const { users, scores } = await getCollections();
	const user = await users.findOne({ _id: new ObjectId(input.userId) });
	if (!user) {
		throw new Error('User not found');
	}

	const totalScore = input.rounds.reduce((sum, round) => sum + round.score, 0);
	const playedAt = new Date();
	const result = await scores.insertOne({
		userId: user._id,
		username: user.username,
		avatar: user.avatar,
		modeKey: input.modeKey,
		roundCount: input.roundCount,
		timerSeconds: input.timerSeconds,
		totalScore,
		isTopThreeForUser: false,
		playedAt,
		rounds: input.rounds
	});

	await syncTopThreeFlagsForUser(input.userId);

	const inserted = await scores.findOne({ _id: result.insertedId });
	if (!inserted) {
		throw new Error('Score could not be loaded after insert');
	}

	return toScoreEntry(inserted);
}

export async function updateUserProfile(
	userId: string,
	profile: { username: string; email: string; bio: string }
) {
	const { users, scores } = await getCollections();
	const objectId = new ObjectId(userId);

	const updatedAt = new Date();
	await users.updateOne(
		{ _id: objectId },
		{
			$set: {
				username: profile.username,
				email: profile.email,
				bio: profile.bio,
				updatedAt
			}
		}
	);
	await scores.updateMany(
		{ userId: objectId },
		{
			$set: {
				username: profile.username
			}
		}
	);

	return getUserById(userId);
}

export async function getRandomPictures(count: number) {
	const { pictures } = await getCollections();
	const idDocuments = await pictures.find({}, { projection: { _id: 1 } }).toArray();

	if (!idDocuments.length) {
		return [];
	}

	const shuffledIds = [...idDocuments];

	for (let index = shuffledIds.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[shuffledIds[index], shuffledIds[swapIndex]] = [shuffledIds[swapIndex], shuffledIds[index]];
	}

	const selectedIds = shuffledIds.slice(0, Math.min(count, shuffledIds.length)).map((entry) => entry._id);
	const documents = await pictures.find({ _id: { $in: selectedIds } }).toArray();
	const byId = new Map(documents.map((document) => [document._id?.toString() ?? '', document]));

	const orderedDocuments: PictureDocument[] = [];

	for (const id of selectedIds) {
		const document = byId.get(id.toString());
		if (document) {
			orderedDocuments.push(document);
		}
	}

	return orderedDocuments.map((document) => toRoundImage(document));
}

export async function listPictures() {
	const { pictures } = await getCollections();
	const documents = await pictures.find().sort({ name: 1 }).toArray();

	return documents.map((document) => toPictureRecord(document));
}

export async function getPictureDocumentById(pictureId: string) {
	const { pictures } = await getCollections();
	return pictures.findOne({ _id: new ObjectId(pictureId) });
}

export async function buildBootstrap(userId: string): Promise<BootstrapPayload> {
	const [currentUser, profileScores, leaderboardScores] = await Promise.all([
		getUserById(userId),
		getUserScores(userId),
		getLeaderboardScores()
	]);

	return {
		currentUser,
		profileScores,
		leaderboardScores
	};
}
