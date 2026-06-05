import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { derived, get, writable } from 'svelte/store';
import type {
	AppState,
	BootstrapPayload,
	GameMode,
	Point,
	RoundImage,
	RoundResult,
	ScoreEntry
} from '$lib/types';

const STORAGE_KEY = 'deadlock-geoguesser-active-user';
const MAP_SIZE = 100;
const MAP_DIAGONAL = Math.hypot(MAP_SIZE, MAP_SIZE);

const defaultState: AppState = {
	currentUser: null,
	profileScores: [],
	leaderboardScores: [],
	currentGame: null
};

function modeKey(roundCount: number, timerSeconds: number) {
	return `${roundCount}-${timerSeconds}`;
}

function scoreFromDistance(distance: number) {
	return Math.max(0, Math.round(5000 * (1 - distance / MAP_DIAGONAL)));
}

function distanceBetween(left: Point, right: Point) {
	return Math.hypot(left.x - right.x, left.y - right.y);
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
	const response = await fetch(input, init);
	const contentType = response.headers.get('content-type') ?? '';
	const data = contentType.includes('application/json')
		? await response.json()
		: { message: await response.text() };

	if (!response.ok) {
		throw new Error(
			typeof data.message === 'string' && data.message.trim()
				? data.message
				: `Request failed with status ${response.status}`
		);
	}

	return data as T;
}

function createAppStore() {
	const { subscribe, set, update } = writable<AppState>(defaultState);
	let initialized = false;
	let initPromise: Promise<void> | null = null;

	function persistActiveUser(currentUser: BootstrapPayload['currentUser']) {
		if (!browser) {
			return;
		}

		if (currentUser?.id) {
			localStorage.setItem(STORAGE_KEY, currentUser.id);
			return;
		}

		localStorage.removeItem(STORAGE_KEY);
	}

	function applyBootstrap(payload: BootstrapPayload) {
		update((state) => ({
			...state,
			currentUser: payload.currentUser,
			profileScores: payload.profileScores,
			leaderboardScores: payload.leaderboardScores
		}));

		persistActiveUser(payload.currentUser);
	}

	async function refreshFromServer(userId: string) {
		const payload = await requestJson<BootstrapPayload>(
			`/api/bootstrap?userId=${encodeURIComponent(userId)}`
		);

		applyBootstrap(payload);
		return payload;
	}

	return {
		subscribe,
		async init() {
			if (initialized) {
				return;
			}

			if (!browser) {
				initialized = true;
				return;
			}

			if (!initPromise) {
				initPromise = (async () => {
					const userId = localStorage.getItem(STORAGE_KEY);

					if (!userId) {
						set(defaultState);
						initialized = true;
						return;
					}

					try {
						await refreshFromServer(userId);
					} catch {
						localStorage.removeItem(STORAGE_KEY);
						set(defaultState);
					}

					initialized = true;
				})();
			}

			await initPromise;
		},
		async login(email: string, password: string) {
			try {
				const payload = await requestJson<BootstrapPayload>('/api/auth/login', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ email, password })
				});

				applyBootstrap(payload);
				return {
					success: true,
					message: `Willkommen zurück, ${payload.currentUser?.username ?? 'Scout'}.`
				};
			} catch (error) {
				return {
					success: false,
					message: error instanceof Error ? error.message : 'Login fehlgeschlagen.'
				};
			}
		},
		async signup(email: string, password: string, username: string) {
			try {
				const payload = await requestJson<BootstrapPayload>('/api/auth/signup', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ email, password, username })
				});

				applyBootstrap(payload);
				return {
					success: true,
					message: `Account für ${payload.currentUser?.username ?? 'Scout'} wurde erstellt.`
				};
			} catch (error) {
				return {
					success: false,
					message: error instanceof Error ? error.message : 'Signup fehlgeschlagen.'
				};
			}
		},
		logout() {
			if (browser) {
				localStorage.removeItem(STORAGE_KEY);
			}

			set(defaultState);
			goto('/');
		},
		async updateProfile(payload: { username: string; email: string; bio: string }) {
			const state = get({ subscribe });
			if (!state.currentUser) {
				return { success: false, message: 'Kein aktiver User.' };
			}

			try {
				const response = await requestJson<{ user: BootstrapPayload['currentUser'] }>(
					`/api/users/${state.currentUser.id}`,
					{
						method: 'PATCH',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify(payload)
					}
				);

				update((state) => ({
					...state,
					currentUser: response.user,
					profileScores: state.profileScores.map((score) => ({
						...score,
						username: payload.username
					})),
					leaderboardScores: state.leaderboardScores.map((score) =>
						score.userId === state.currentUser?.id
							? { ...score, username: payload.username }
							: score
					)
				}));

				return { success: true, message: 'Profil gespeichert.' };
			} catch (error) {
				return {
					success: false,
					message: error instanceof Error ? error.message : 'Profil konnte nicht gespeichert werden.'
				};
			}
		},
		async startGame(mode: GameMode) {
			const payload = await requestJson<{ pictures: RoundImage[] }>(
				`/api/pictures/random?count=${mode.roundCount}`
			);

			update((state) => ({
				...state,
				currentGame: {
					mode,
					modeKey: modeKey(mode.roundCount, mode.timerSeconds),
					images: payload.pictures,
					roundIndex: 0,
					roundStartedAt: Date.now(),
					results: [],
					status: 'playing',
					finalScore: null
				}
			}));
		},
		async submitGuess(guess: Point | null) {
			let finished = false;
			let savePayload: {
				userId: string;
				modeKey: string;
				roundCount: number;
				timerSeconds: number;
				rounds: RoundResult[];
			} | null = null;

			update((state) => {
				if (!state.currentGame || state.currentGame.status !== 'playing' || !state.currentUser) {
					return state;
				}

				const game = state.currentGame;
				const image = game.images[game.roundIndex];
				const distance = guess ? distanceBetween(guess, image.actual) : MAP_DIAGONAL;
				const result: RoundResult = {
					imageId: image.id,
					imageName: image.name,
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
				savePayload = {
					userId: state.currentUser.id,
					modeKey: game.modeKey,
					roundCount: game.mode.roundCount,
					timerSeconds: game.mode.timerSeconds,
					rounds: results
				};
				finished = true;

				return {
					...state,
					currentGame: {
						...game,
						results,
						status: 'finished',
						finalScore: totalScore
					}
				};
			});

			if (savePayload) {
				try {
					const payload = await requestJson<BootstrapPayload>('/api/scores', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify(savePayload)
					});

					applyBootstrap(payload);
				} catch (error) {
					return {
						finished,
						error: error instanceof Error ? error.message : 'Score konnte nicht gespeichert werden.'
					};
				}
			}

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

export const activeUser = derived(appStore, ($appStore) => $appStore.currentUser);

export const isAuthenticated = derived(appStore, ($appStore) => Boolean($appStore.currentUser));

export const currentGame = derived(appStore, ($appStore) => $appStore.currentGame);

export const profileScores = derived(appStore, ($appStore) => $appStore.profileScores);

export const leaderboardByMode = derived(appStore, ($appStore) => {
	const grouped = new Map<string, ScoreEntry[]>();

	for (const score of $appStore.leaderboardScores) {
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
