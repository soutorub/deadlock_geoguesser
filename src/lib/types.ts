export type RoundCount = 5 | 10 | 20 | 30;
export type TimerSeconds = 10 | 30 | 60;

export type Point = {
	x: number;
	y: number;
};

export type GameMode = {
	roundCount: RoundCount;
	timerSeconds: TimerSeconds;
};

export type RoundImage = {
	id: string;
	title: string;
	district: string;
	hint: string;
	description: string;
	imageUrl: string;
	actual: Point;
};

export type RoundResult = {
	imageId: string;
	imageTitle: string;
	distance: number;
	score: number;
	guess: Point | null;
	actual: Point;
};

export type ScoreEntry = {
	id: string;
	userId: string;
	username: string;
	avatar: string;
	modeKey: string;
	roundCount: RoundCount;
	timerSeconds: TimerSeconds;
	totalScore: number;
	playedAt: string;
	rounds: RoundResult[];
};

export type ModeStats = {
	bestScore: number;
	lastScore: number;
	averageScore: number;
	gamesPlayed: number;
	lastPlayedAt: string | null;
};

export type UserRecord = {
	id: string;
	email: string;
	password: string;
	username: string;
	avatar: string;
	bio: string;
	createdAt: string;
	modeStats: Record<string, ModeStats>;
};

export type CurrentGame = {
	mode: GameMode;
	modeKey: string;
	images: RoundImage[];
	roundIndex: number;
	roundStartedAt: number;
	results: RoundResult[];
	status: 'playing' | 'finished';
	finalScore: number | null;
};

export type AppState = {
	users: UserRecord[];
	scores: ScoreEntry[];
	activeUserId: string | null;
	currentGame: CurrentGame | null;
};
