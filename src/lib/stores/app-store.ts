import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { derived, writable } from 'svelte/store';
import { roundImages, starterScores, starterUsers } from '$lib/data';
import type {
	AppState,
	GameMode,
	ModeStats,
	Point,
	RoundResult,
	ScoreEntry,
	UserRecord
} from '$lib/types';

const STORAGE_KEY = 'deadlock-geoguesser-prototype';
const MAP_SIZE = 100;
const MAP_DIAGONAL = Math.hypot(MAP_SIZE, MAP_SIZE);

const defaultState: AppState = {
	users: starterUsers,
	scores: starterScores,
	activeUserId: null,
	currentGame: null
};

function modeKey(roundCount: number, timerSeconds: number) {
	return `${roundCount}-${timerSeconds}`;
}

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
			timers.map((timerSeconds) => [modeKey(roundCount, timerSeconds), createEmptyStats()])
		)
	);
}

function shuffle<T>(items: T[]) {
	return [...items]
		.map((item) => ({ item, sort: Math.random() }))
		.sort((left, right) => left.sort - right.sort)
		.map(({ item }) => item);
}

function loadState(): AppState {
	if (!browser) {
		return defaultState;
	}

	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) {
		return defaultState;
	}

	try {
		const parsed = JSON.parse(raw) as AppState;
		return {
			...defaultState,
			...parsed,
			users: parsed.users?.length ? parsed.users : defaultState.users,
			scores: parsed.scores?.length ? parsed.scores : defaultState.scores
		};
	} catch {
		return defaultState;
	}
}

function persistState(state: AppState) {
	if (!browser) {
		return;
	}

	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function scoreFromDistance(distance: number) {
	return Math.max(0, Math.round(5000 * (1 - distance / MAP_DIAGONAL)));
}

function distanceBetween(left: Point, right: Point) {
	return Math.hypot(left.x - right.x, left.y - right.y);
}

function updateUserModeStats(user: UserRecord, score: ScoreEntry): UserRecord {
	const key = score.modeKey;
	const existing = user.modeStats[key] ?? createEmptyStats();
	const gamesPlayed = existing.gamesPlayed + 1;
	const averageScore = Math.round(
		(existing.averageScore * existing.gamesPlayed + score.totalScore) / gamesPlayed
	);

	return {
		...user,
		modeStats: {
			...user.modeStats,
			[key]: {
				bestScore: Math.max(existing.bestScore, score.totalScore),
				lastScore: score.totalScore,
				averageScore,
				gamesPlayed,
				lastPlayedAt: score.playedAt
			}
		}
	};
}

function createAppStore() {
	const { subscribe, update, set } = writable<AppState>(defaultState);
	let initialized = false;

	function ensureInitialized() {
		if (initialized) {
			return;
		}

		const state = loadState();
		set(state);
		initialized = true;
	}

	subscribe((state) => {
		if (initialized) {
			persistState(state);
		}
	});

	return {
		subscribe,
		init: ensureInitialized,
		login(email: string, password: string) {
			let success = false;
			let message = 'Login fehlgeschlagen.';

			update((state) => {
				const user = state.users.find(
					(entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password
				);

				if (!user) {
					message = 'E-Mail oder Passwort stimmt nicht.';
					return state;
				}

				success = true;
				message = `Willkommen zurueck, ${user.username}.`;

				return {
					...state,
					activeUserId: user.id
				};
			});

			return { success, message };
		},
		signup(email: string, password: string, username: string) {
			let success = false;
			let message = 'Signup fehlgeschlagen.';

			update((state) => {
				const emailExists = state.users.some(
					(entry) => entry.email.toLowerCase() === email.toLowerCase()
				);

				if (emailExists) {
					message = 'Diese E-Mail ist bereits registriert.';
					return state;
				}

				const userId = `user-${crypto.randomUUID()}`;
				const avatar = username
					.split(' ')
					.map((part) => part[0]?.toUpperCase() ?? '')
					.join('')
					.slice(0, 2);
				const nextUser: UserRecord = {
					id: userId,
					email,
					password,
					username,
					avatar: avatar || 'DG',
					bio: 'Neuer Deadlock-Scout.',
					createdAt: new Date().toISOString(),
					modeStats: buildAllModeStats()
				};

				success = true;
				message = `Account fuer ${username} wurde erstellt.`;

				return {
					...state,
					users: [...state.users, nextUser],
					activeUserId: userId
				};
			});

			return { success, message };
		},
		logout() {
			update((state) => ({
				...state,
				activeUserId: null,
				currentGame: null
			}));
			goto('/');
		},
		updateProfile(payload: { username: string; email: string; bio: string }) {
			update((state) => {
				if (!state.activeUserId) {
					return state;
				}

				return {
					...state,
					users: state.users.map((user) =>
						user.id === state.activeUserId
							? { ...user, username: payload.username, email: payload.email, bio: payload.bio }
							: user
					),
					scores: state.scores.map((score) =>
						score.userId === state.activeUserId
							? {
									...score,
									username: payload.username
								}
							: score
					)
				};
			});
		},
		startGame(mode: GameMode) {
			update((state) => ({
				...state,
				currentGame: {
					mode,
					modeKey: modeKey(mode.roundCount, mode.timerSeconds),
					images: shuffle(roundImages).slice(0, mode.roundCount),
					roundIndex: 0,
					roundStartedAt: Date.now(),
					results: [],
					status: 'playing',
					finalScore: null
				}
			}));
		},
		submitGuess(guess: Point | null) {
			let finished = false;

			update((state) => {
				if (!state.currentGame || state.currentGame.status !== 'playing' || !state.activeUserId) {
					return state;
				}

				const game = state.currentGame;
				const image = game.images[game.roundIndex];
				const distance = guess ? distanceBetween(guess, image.actual) : MAP_DIAGONAL;
				const result: RoundResult = {
					imageId: image.id,
					imageTitle: image.title,
					distance: Math.round(distance * 10) / 10,
					score: guess ? scoreFromDistance(distance) : 0,
					guess,
					actual: image.actual
				};
				const results = [...game.results, result];
				const isLastRound = game.roundIndex === game.images.length - 1;

				if (!isLastRound) {
					return {
						...state,
						currentGame: {
							...game,
							results,
							roundIndex: game.roundIndex + 1,
							roundStartedAt: Date.now()
						}
					};
				}

				const totalScore = results.reduce((sum, entry) => sum + entry.score, 0);
				const user = state.users.find((entry) => entry.id === state.activeUserId);
				if (!user) {
					return state;
				}

				const score: ScoreEntry = {
					id: `score-${crypto.randomUUID()}`,
					userId: user.id,
					username: user.username,
					avatar: user.avatar,
					modeKey: game.modeKey,
					roundCount: game.mode.roundCount,
					timerSeconds: game.mode.timerSeconds,
					totalScore,
					playedAt: new Date().toISOString(),
					rounds: results
				};

				finished = true;

				return {
					...state,
					users: state.users.map((entry) =>
						entry.id === user.id ? updateUserModeStats(entry, score) : entry
					),
					scores: [score, ...state.scores],
					currentGame: {
						...game,
						results,
						status: 'finished',
						finalScore: totalScore
					}
				};
			});

			return { finished };
		},
		resetGame() {
			update((state) => ({
				...state,
				currentGame: null
			}));
		}
	};
}

export const appStore = createAppStore();

export const activeUser = derived(appStore, ($appStore) =>
	$appStore.users.find((user) => user.id === $appStore.activeUserId) ?? null
);

export const isAuthenticated = derived(appStore, ($appStore) => Boolean($appStore.activeUserId));

export const currentGame = derived(appStore, ($appStore) => $appStore.currentGame);

export const leaderboardByMode = derived(appStore, ($appStore) => {
	const grouped = new Map<string, ScoreEntry[]>();

	for (const score of $appStore.scores) {
		const bucket = grouped.get(score.modeKey) ?? [];
		bucket.push(score);
		grouped.set(score.modeKey, bucket);
	}

	return Array.from(grouped.entries())
		.map(([key, scores]) => ({
			modeKey: key,
			roundCount: scores[0]?.roundCount ?? 5,
			timerSeconds: scores[0]?.timerSeconds ?? 10,
			scores: [...scores].sort((left, right) => right.totalScore - left.totalScore)
		}))
		.sort((left, right) => {
			if (left.roundCount !== right.roundCount) {
				return left.roundCount - right.roundCount;
			}

			return left.timerSeconds - right.timerSeconds;
		});
});
