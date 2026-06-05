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

<div class="card border-success-subtle shadow-sm app-panel-card mb-4">
	<div class="card-body p-4">
		<div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
			<div>
				<p class="text-uppercase small fw-semibold text-success mb-1">Global Highscore</p>
				<h2 class="h4 mb-0">Modus filtern</h2>
			</div>
			<div class="d-flex gap-2 flex-wrap">
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
	</div>
</div>

<section class="card border-success-subtle shadow-sm app-panel-card">
	<div class="card-body p-4">
		<div class="d-flex justify-content-between align-items-end gap-3 flex-wrap mb-3">
			<div>
				<p class="text-uppercase small fw-semibold text-success mb-1">Global Highscore</p>
				<h2 class="h4 mb-0">Passende Spiele</h2>
			</div>
			<p class="small text-body-secondary mb-0">
				Angezeigt werden nur Runden für {matchingGamesLabel}.
			</p>
		</div>

		{#if filteredScores.length}
			<Podium scores={topThreeScores} />

			<div class="table-responsive mt-4">
				<table class="table align-middle mb-0">
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
			<div class="card border-success-subtle app-stat-card">
					<div class="card-body text-body-secondary">
						Keine Highscore-Einträge für den ausgewählten Filter.
					</div>
			</div>
		{/if}
	</div>
</section>
