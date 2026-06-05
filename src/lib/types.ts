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
	name: string;
	imageUrl: string;
	actual: Point;
};

export type RoundResult = {
	imageId: string;
	imageName: string;
	distance: number;
	score: number;
	guess: Point | null;
	actual: Point;
};

export type PictureRecord = {
	id: string;
	name: string;
	imageUrl: string;
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
	isTopThreeForUser: boolean;
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
	username: string;
	avatar: string;
	bio: string;
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
	currentUser: UserRecord | null;
	profileScores: ScoreEntry[];
	leaderboardScores: ScoreEntry[];
	currentGame: CurrentGame | null;
};

export type BootstrapPayload = {
	currentUser: UserRecord | null;
	profileScores: ScoreEntry[];
	leaderboardScores: ScoreEntry[];
};
