<svelte:options runes={false} />

<script lang="ts">
	import Podium from '$lib/components/Podium.svelte';
	import { leaderboardByMode } from '$lib/stores/app-store';
	let selectedRoundCount = 'all';
	let selectedTimer = 'all';

	const roundCounts = [5, 10, 20, 30];
	const timers = [10, 30, 60];

	function timerLabel(timer: number) {
		return timer === 60 ? '1 min' : `${timer} sek`;
	}

	$: filteredBoards = $leaderboardByMode.filter((board) => {
		const roundMatches =
			selectedRoundCount === 'all' || board.roundCount === Number(selectedRoundCount);
		const timerMatches = selectedTimer === 'all' || board.timerSeconds === Number(selectedTimer);
		return roundMatches && timerMatches;
	});

	$: filteredScores = filteredBoards
		.flatMap((board) => board.scores)
		.sort((left, right) => right.totalScore - left.totalScore);

	$: topThreeScores = filteredScores.slice(0, 3);

	$: matchingGamesLabel = [
		selectedRoundCount === 'all' ? 'alle Bildanzahlen' : `${selectedRoundCount} Bilder`,
		selectedTimer === 'all' ? 'alle Timer' : timerLabel(Number(selectedTimer))
	].join(' · ');
</script>

<svelte:head>
	<title>Leaderboard | Deadlock GeoGuesser</title>
</svelte:head>

<section class="app-panel-card leaderboard-panel leaderboard-filter-panel">
	<div class="leaderboard-panel-topline">
		<div>
			<p class="app-eyebrow">Global Highscore</p>
			<h2 class="app-section-title">Modus filtern</h2>
		</div>
		<div class="leaderboard-filter-row">
			<select class="form-select" bind:value={selectedRoundCount}>
				<option value="all">Alle Bildanzahlen</option>
				{#each roundCounts as count}
					<option value={String(count)}>{count} Bilder</option>
				{/each}
			</select>
			<select class="form-select" bind:value={selectedTimer}>
				<option value="all">Alle Timer</option>
				{#each timers as timer}
					<option value={String(timer)}>{timerLabel(timer)}</option>
				{/each}
			</select>
		</div>
	</div>
</section>

<section class="app-panel-card leaderboard-panel">
	<div class="leaderboard-panel-topline">
		<div>
			<p class="app-eyebrow">Global Highscore</p>
			<h2 class="app-section-title">Passende Spiele</h2>
		</div>
		<p class="leaderboard-copy">
			Angezeigt werden nur Runden für {matchingGamesLabel}.
		</p>
	</div>

		{#if filteredScores.length}
			<Podium scores={topThreeScores} />

			<div class="app-table-wrap">
				<table class="table leaderboard-table">
					<thead>
						<tr>
							<th>Rang</th>
							<th>Spieler</th>
							<th>Modus</th>
							<th>Score</th>
							<th>Datum</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredScores as score, index}
							<tr>
								<td>#{index + 1}</td>
								<td>{score.username}</td>
								<td>{score.roundCount} Bilder / {timerLabel(score.timerSeconds)}</td>
								<td>{score.totalScore}</td>
								<td>{new Date(score.playedAt).toLocaleDateString('de-CH')}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="app-stat-card leaderboard-empty-state">
				Keine Highscore-Einträge für den ausgewählten Filter.
			</div>
		{/if}
</section>

<style>
	.leaderboard-panel {
		padding: 1.8rem;
	}

	.leaderboard-filter-panel {
		margin-bottom: 1.35rem;
	}

	.leaderboard-panel-topline {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 1rem;
		flex-wrap: wrap;

		.app-section-title {
			margin-bottom: 0;
		}
	}

	.leaderboard-filter-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.leaderboard-copy {
		margin: 0;
		color: var(--app-color-text-muted);
	}

	.leaderboard-empty-state {
		padding: 1.2rem;
		color: var(--app-color-text-muted);
	}

	.leaderboard-table {
		margin: 0;
	}
</style>
