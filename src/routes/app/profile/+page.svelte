<svelte:options runes={false} />

<script lang="ts">
	import { activeUser, appStore } from '$lib/stores/app-store';
	import { derived } from 'svelte/store';
	import { appStore as stateStore } from '$lib/stores/app-store';

	let editing = false;
	let username = '';
	let email = '';
	let bio = '';
	let selectedRoundCount = 'all';
	let selectedTimer = 'all';

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

	const profileScores = derived([stateStore, activeUser], ([$store, $activeUser]) => {
		if (!$activeUser) {
			return [];
		}

		return $store.scores
			.filter((score) => score.userId === $activeUser.id)
			.sort((left, right) => new Date(right.playedAt).getTime() - new Date(left.playedAt).getTime());
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

	$: filteredScores = $profileScores.filter((score) => {
		const roundMatches = selectedRoundCount === 'all' || score.roundCount === Number(selectedRoundCount);
		const timerMatches = selectedTimer === 'all' || score.timerSeconds === Number(selectedTimer);
		return roundMatches && timerMatches;
	});

	$: matchingGamesLabel = [
		selectedRoundCount === 'all' ? 'alle Bildanzahlen' : `${selectedRoundCount} Bilder`,
		selectedTimer === 'all' ? 'alle Timer' : `${labelForTimer(Number(selectedTimer))}`
	].join(' · ');

	function saveProfile(event: SubmitEvent) {
		event.preventDefault();
		appStore.updateProfile({ username, email, bio });
		editing = false;
	}
</script>

<svelte:head>
	<title>Profil | Deadlock GeoGuesser</title>
</svelte:head>

{#if $activeUser}
	<div class="row g-4">
		<div class="col-lg-4">
			<section class="card border-success-subtle shadow-sm profile-card h-100">
				<div class="card-body p-4">
					<div class="d-flex align-items-center gap-3">
						<div class="avatar">{$activeUser.avatar}</div>
						<div>
							<h2 class="h4 mb-1">{$activeUser.username}</h2>
							<p class="text-body-secondary mb-0">{$activeUser.email}</p>
						</div>
					</div>

					<p class="bio text-body-secondary">{$activeUser.bio}</p>

					<button class="btn btn-success w-100" type="button" onclick={() => (editing = !editing)}>
						{editing ? 'Bearbeitung schliessen' : 'Profil bearbeiten'}
					</button>

					{#if editing}
						<form class="edit-form mt-3" onsubmit={saveProfile}>
							<div>
								<label class="form-label" for="profile-username">Username</label>
								<input id="profile-username" class="form-control" bind:value={username} required />
							</div>
							<div>
								<label class="form-label" for="profile-email">E-Mail</label>
								<input id="profile-email" class="form-control" bind:value={email} type="email" required />
							</div>
							<div>
								<label class="form-label" for="profile-bio">Bio</label>
								<textarea id="profile-bio" class="form-control" bind:value={bio} rows="4"></textarea>
							</div>
							<button class="btn btn-outline-success" type="submit">Speichern</button>
						</form>
					{/if}
				</div>
			</section>
		</div>

		<div class="col-lg-8">
			<section class="card border-success-subtle shadow-sm profile-card mb-4">
				<div class="card-body p-4">
					<div class="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
						<div>
							<p class="text-uppercase small fw-semibold text-success mb-1">Scores pro Spielart</p>
							<h2 class="h4 mb-0">Gefilterte Modi</h2>
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
									<option value={String(timer)}>{labelForTimer(timer)}</option>
								{/each}
							</select>
						</div>
					</div>

					<p class="small text-body-secondary mb-3">
						Angezeigt werden die Statistikwerte fuer {matchingGamesLabel}.
					</p>

					<div class="table-responsive">
						<table class="table align-middle">
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
				</div>
			</section>

			<section class="card border-success-subtle shadow-sm profile-card">
				<div class="card-body p-4">
					<h3 class="h5 mb-1">Vergangene Scores</h3>
					<p class="small text-body-secondary mb-3">
						Hier siehst du nur die gespielten Runden, die zu {matchingGamesLabel} passen.
					</p>
					<div class="table-responsive">
						<table class="table align-middle mb-0">
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
										<td colspan="4" class="text-body-secondary">Keine Scores fuer den gewaelten Filter.</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</div>
	</div>
{/if}

<style>
	.avatar {
		width: 4rem;
		height: 4rem;
		border-radius: 999px;
		display: grid;
		place-items: center;
		background: linear-gradient(135deg, #3ddc84, #89f7b5);
		color: #07100b;
		font-size: 1.4rem;
		font-weight: 800;
	}

	.bio,
	.edit-form {
		display: grid;
		gap: 0.9rem;
	}

	.bio {
		margin: 1rem 0 1.2rem;
	}

	.profile-card {
		background: rgba(8, 17, 12, 0.9);
	}
</style>
