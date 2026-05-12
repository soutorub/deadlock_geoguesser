import type { GameMode, RoundImage, ScoreEntry, UserRecord } from '$lib/types';

const artUrls = [
	'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80',
	'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
	'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
	'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
	'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
	'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80'
];

const zones = [
	{ district: 'Canal Row', x: 18, y: 22, vibe: 'enge Gassen mit Neon-Schildern' },
	{ district: 'Factory Spine', x: 42, y: 18, vibe: 'Industriebruecken und Rohre' },
	{ district: 'Skyline Market', x: 74, y: 24, vibe: 'Daecher, Marktstaende und Banner' },
	{ district: 'The Rail Yards', x: 24, y: 54, vibe: 'verlassene Schienen und Lagerhallen' },
	{ district: 'Mid Plaza', x: 50, y: 48, vibe: 'offene Hauptstrasse mit Statue' },
	{ district: 'Ember Docks', x: 78, y: 58, vibe: 'Kaianlagen mit orangefarbenem Rauch' },
	{ district: 'Archive Steps', x: 34, y: 76, vibe: 'Treppen, Boegen und Bibliothekslicht' },
	{ district: 'Citadel Heights', x: 68, y: 78, vibe: 'hochgelegene Terrassen mit Wind' }
];

export const roundImages: RoundImage[] = Array.from({ length: 30 }, (_, index) => {
	const zone = zones[index % zones.length];
	const offset = (index % 5) * 3;

	return {
		id: `img-${index + 1}`,
		title: `Deadlock Snapshot ${index + 1}`,
		district: zone.district,
		hint: `Achte auf ${zone.vibe}.`,
		description: `Intel-Foto aus ${zone.district} mit Fokus auf ${zone.vibe}.`,
		imageUrl: artUrls[index % artUrls.length],
		actual: {
			x: Math.min(92, zone.x + (index % 2 === 0 ? offset : -offset)),
			y: Math.min(90, zone.y + (index % 3 === 0 ? offset : -offset / 2))
		}
	};
});

const statsKeys = [
	'5-10',
	'5-30',
	'5-60',
	'10-10',
	'10-30',
	'10-60',
	'20-10',
	'20-30',
	'20-60',
	'30-10',
	'30-30',
	'30-60'
];

const buildModeStats = (seed: number) =>
	Object.fromEntries(
		statsKeys.map((key, index) => [
			key,
			{
				bestScore: 18500 + seed * 700 + index * 145,
				lastScore: 16000 + seed * 500 + index * 120,
				averageScore: 17100 + seed * 550 + index * 132,
				gamesPlayed: 2 + ((seed + index) % 6),
				lastPlayedAt: `2026-04-${String(10 + ((seed + index) % 12)).padStart(2, '0')}T18:30:00.000Z`
			}
		])
	);

export const starterUsers: UserRecord[] = [
	{
		id: 'user-ruben',
		email: 'ruben@prototype.gg',
		password: 'deadlock123',
		username: 'RubenScout',
		avatar: 'RS',
		bio: 'Mag kurze Runden und schnelle Instinkte.',
		createdAt: '2026-03-12T10:00:00.000Z',
		modeStats: buildModeStats(1)
	},
	{
		id: 'user-mira',
		email: 'mira@prototype.gg',
		password: 'deadlock123',
		username: 'MiraLane',
		avatar: 'ML',
		bio: 'Sammelt Highscores auf den 30-Sekunden-Modi.',
		createdAt: '2026-02-18T09:10:00.000Z',
		modeStats: buildModeStats(2)
	},
	{
		id: 'user-zen',
		email: 'zen@prototype.gg',
		password: 'deadlock123',
		username: 'ZenAnchor',
		avatar: 'ZA',
		bio: 'Bleibt ruhig, punktet konstant.',
		createdAt: '2026-01-24T16:15:00.000Z',
		modeStats: buildModeStats(3)
	},
	{
		id: 'user-ivy',
		email: 'ivy@prototype.gg',
		password: 'deadlock123',
		username: 'IvyShift',
		avatar: 'IS',
		bio: 'Perfekte Dock- und Mid-Plaza-Leserin.',
		createdAt: '2026-04-02T12:20:00.000Z',
		modeStats: buildModeStats(4)
	}
];

const sampleModes: GameMode[] = [
	{ roundCount: 5, timerSeconds: 10 },
	{ roundCount: 5, timerSeconds: 30 },
	{ roundCount: 10, timerSeconds: 30 },
	{ roundCount: 20, timerSeconds: 60 }
];

export const starterScores: ScoreEntry[] = starterUsers.flatMap((user, userIndex) =>
	sampleModes.map((mode, modeIndex) => ({
		id: `score-${user.id}-${mode.roundCount}-${mode.timerSeconds}`,
		userId: user.id,
		username: user.username,
		avatar: user.avatar,
		modeKey: `${mode.roundCount}-${mode.timerSeconds}`,
		roundCount: mode.roundCount,
		timerSeconds: mode.timerSeconds,
		totalScore: 17100 + userIndex * 1450 + modeIndex * 880,
		playedAt: `2026-04-${String(12 + userIndex + modeIndex).padStart(2, '0')}T20:15:00.000Z`,
		rounds: roundImages.slice(0, mode.roundCount).map((image, imageIndex) => ({
			imageId: image.id,
			imageTitle: image.title,
			distance: 8 + imageIndex * 1.5,
			score: Math.max(1600, 4200 - imageIndex * 130 - userIndex * 80),
			guess: { x: image.actual.x + 2, y: image.actual.y - 2 },
			actual: image.actual
		}))
	}))
);
