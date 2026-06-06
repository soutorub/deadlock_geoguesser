<svelte:options runes={false} />

<script lang="ts">
	import { activeUser, appStore, profileScores } from '$lib/stores/app-store';
	import { derived } from 'svelte/store';

	let editing = false;
	let username = '';
	let email = '';
	let bio = '';
	let selectedRoundCount = 'all';
	let selectedTimer = 'all';
	let saveMessage = '';

	$: if ($activeUser && !editing) {
		username = $activeUser.username;
		email = $activeUser.email;
		bio = $activeUser.bio;
	}

	const roundCounts = [5, 10, 20, 30];
	const timers = [10, 30, 60];

	function labelForTimer(timer: number) {
		return timer === 60 ? '1 min' : `${timer} sek`;
	}

	const orderedProfileScores = derived([profileScores, activeUser], ([$profileScores, $activeUser]) => {
		if (!$activeUser) {
			return [];
		}

		return [...$profileScores].sort(
			(left, right) => new Date(right.playedAt).getTime() - new Date(left.playedAt).getTime()
		);
	});

	$: filteredStats = roundCounts.flatMap((count) =>
		timers
			.filter((timer) => selectedTimer === 'all' || timer === Number(selectedTimer))
			.filter(() => selectedRoundCount === 'all' || count === Number(selectedRoundCount))
			.map((timer) => ({
				key: `${count}-${timer}`,
				count,
				timer,
				stats: $activeUser?.modeStats[`${count}-${timer}`]
			}))
	);

	$: filteredScores = $orderedProfileScores.filter((score) => {
		const roundMatches = selectedRoundCount === 'all' || score.roundCount === Number(selectedRoundCount);
		const timerMatches = selectedTimer === 'all' || score.timerSeconds === Number(selectedTimer);
		return roundMatches && timerMatches;
	});

	$: matchingGamesLabel = [
		selectedRoundCount === 'all' ? 'alle Bildanzahlen' : `${selectedRoundCount} Bilder`,
		selectedTimer === 'all' ? 'alle Timer' : `${labelForTimer(Number(selectedTimer))}`
	].join(' · ');

	async function saveProfile(event: SubmitEvent) {
		event.preventDefault();
		const result = await appStore.updateProfile({ username, email, bio });
		saveMessage = result.message;

		if (result.success) {
			editing = false;
		}
	}
</script>

<svelte:head>
	<title>Profil | Deadlock GeoGuesser</title>
</svelte:head>

{#if $activeUser}
	<div class="profile-grid">
		<section class="app-panel-card profile-panel profile-summary-panel">
			<div class="profile-summary">
				<div class="profile-avatar">{$activeUser.avatar}</div>
				<div>
					<h2>{$activeUser.username}</h2>
					<p>{$activeUser.email}</p>
				</div>
			</div>

			<p class="profile-bio">{$activeUser.bio}</p>

			<button class="btn btn-success app-button-block" type="button" onclick={() => (editing = !editing)}>
				{editing ? 'Bearbeitung schliessen' : 'Profil bearbeiten'}
			</button>

			{#if editing}
				<form class="profile-form" onsubmit={saveProfile}>
					<div class="profile-field">
						<label for="profile-username">Username</label>
						<input id="profile-username" class="form-control" bind:value={username} required />
					</div>
					<div class="profile-field">
						<label for="profile-email">E-Mail</label>
						<input id="profile-email" class="form-control" bind:value={email} type="email" required />
					</div>
					<div class="profile-field">
						<label for="profile-bio">Bio</label>
						<textarea id="profile-bio" class="form-control" bind:value={bio} rows="4"></textarea>
					</div>
					<button class="btn btn-outline-success" type="submit">Speichern</button>
				</form>
			{/if}

			{#if saveMessage}
				<div class="alert alert-success app-inline-alert">{saveMessage}</div>
			{/if}
		</section>

		<div class="profile-content">
			<section class="app-panel-card profile-panel">
				<div class="profile-panel-topline">
					<div>
						<p class="app-eyebrow">Scores pro Spielart</p>
						<h2 class="app-section-title">Gefilterte Modi</h2>
					</div>
					<div class="profile-filter-row">
						<select class="form-select" bind:value={selectedRoundCount}>
							<option value="all">Alle Bildanzahlen</option>
							{#each roundCounts as count}
								<option value={String(count)}>{count} Bilder</option>
							{/each}
						</select>
						<select class="form-select" bind:value={selectedTimer}>
							<option value="all">Alle Timer</option>
							{#each timers as timer}
								<option value={String(timer)}>{labelForTimer(timer)}</option>
							{/each}
						</select>
					</div>
				</div>

				<p class="profile-copy">Angezeigt werden die Statistikwerte für {matchingGamesLabel}.</p>

				<div class="app-table-wrap">
					<table class="table profile-table">
						<thead>
							<tr>
								<th>Spielart</th>
								<th>Bestscore</th>
								<th>Letzter Score</th>
								<th>Avg.</th>
								<th>Games</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredStats as entry}
								<tr>
									<td>{entry.count} Bilder / {labelForTimer(entry.timer)}</td>
									<td>{entry.stats?.bestScore ?? 0}</td>
									<td>{entry.stats?.lastScore ?? 0}</td>
									<td>{entry.stats?.averageScore ?? 0}</td>
									<td>{entry.stats?.gamesPlayed ?? 0}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>

			<section class="app-panel-card profile-panel">
				<h3 class="profile-subtitle">Vergangene Scores</h3>
				<p class="profile-copy">
					Hier siehst du nur die gespielten Runden, die zu {matchingGamesLabel} passen.
				</p>
				<div class="app-table-wrap">
					<table class="table profile-table profile-table-compact">
						<thead>
							<tr>
								<th>Datum</th>
								<th>Modus</th>
								<th>Score</th>
								<th>Runden</th>
							</tr>
						</thead>
						<tbody>
							{#if filteredScores.length}
								{#each filteredScores as score}
									<tr>
										<td>{new Date(score.playedAt).toLocaleDateString('de-CH')}</td>
										<td>{score.roundCount} Bilder / {labelForTimer(score.timerSeconds)}</td>
										<td>{score.totalScore}</td>
										<td>{score.rounds.length}</td>
									</tr>
								{/each}
							{:else}
								<tr>
									<td colspan="4" class="profile-empty-row">Keine Scores für den gewählten Filter.</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	</div>
{/if}

<style>
	.profile-grid {
		display: grid;
		grid-template-columns: 34% 66%;
		gap: 1.35rem;
		align-items: start;
	}

	.profile-panel {
		padding: 1.8rem;
	}

	.profile-summary-panel {
		display: grid;
		align-content: start;
		gap: 1.2rem;
	}

	.profile-summary {
		display: flex;
		align-items: center;
		gap: 1rem;

		h2 {
			margin: 0 0 0.35rem;
			font-size: 1.6rem;
		}

		p {
			margin: 0;
			color: var(--app-color-text-muted);
		}
	}

	.profile-avatar {
		width: 4rem;
		height: 4rem;
		display: grid;
		place-items: center;
		background: var(--app-color-accent-soft);
		color: var(--app-color-accent-contrast);
		font-size: 1.4rem;
		font-weight: 800;
		border: 1px solid var(--app-color-accent-contrast-border);
	}

	.profile-bio,
	.profile-form,
	.profile-field,
	.profile-content {
		display: grid;
		gap: 0.9rem;
	}

	.profile-bio,
	.profile-copy {
		margin: 0;
		color: var(--app-color-text-muted);
	}

	.profile-field {
		label {
			font-size: 1rem;
			font-weight: 600;
		}
	}

	.profile-panel-topline {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;

		.app-section-title {
			margin-bottom: 0;
		}
	}

	.profile-filter-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.profile-subtitle {
		margin: 0;
		font-size: 1.45rem;
	}

	.profile-table {
		margin: 0;
	}

	.profile-table-compact {
		margin-bottom: 0;
	}

	.profile-empty-row {
		color: var(--app-color-text-muted);
	}
</style>
