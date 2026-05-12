<svelte:options runes={false} />

<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import DeadlockMap from '$lib/components/DeadlockMap.svelte';
	import ModeBadge from '$lib/components/ModeBadge.svelte';
	import { appStore, currentGame } from '$lib/stores/app-store';
	import type { Point } from '$lib/types';

	let selectedGuess: Point | null = null;
	let remainingSeconds = 0;
	let timerHandle: ReturnType<typeof setInterval> | null = null;
	let seenRoundIndex = -1;
	let saveError = '';

	function syncTimer() {
		if (!$currentGame || $currentGame.status !== 'playing') {
			remainingSeconds = 0;
			return;
		}

		const elapsed = Math.floor((Date.now() - $currentGame.roundStartedAt) / 1000);
		remainingSeconds = Math.max(0, $currentGame.mode.timerSeconds - elapsed);
	}

	function restartInterval() {
		if (timerHandle) {
			clearInterval(timerHandle);
		}

		syncTimer();
		timerHandle = setInterval(() => {
			syncTimer();

			if (remainingSeconds === 0 && $currentGame?.status === 'playing') {
				void submitGuess();
			}
		}, 250);
	}

	onMount(() => {
		if (!$currentGame) {
			goto('/app');
			return;
		}

		restartInterval();

		return () => {
			if (timerHandle) {
				clearInterval(timerHandle);
			}
		};
	});

	$: if ($currentGame?.roundIndex !== undefined) {
		if (browser && $currentGame.roundIndex !== seenRoundIndex) {
			seenRoundIndex = $currentGame.roundIndex;
			selectedGuess = null;
			restartInterval();
		}
	}

	async function submitGuess() {
		const result = await appStore.submitGuess(selectedGuess);
		selectedGuess = null;
		saveError = result.error ?? '';

		if (result.finished) {
			if (timerHandle) {
				clearInterval(timerHandle);
			}
		}
	}

	function leaveGame() {
		appStore.resetGame();
		goto('/app');
	}
</script>

<svelte:head>
	<title>Spiel | Deadlock GeoGuesser</title>
</svelte:head>

{#if $currentGame}
	{#if $currentGame.status === 'playing'}
		{@const round = $currentGame.images[$currentGame.roundIndex]}
		<div class="row g-4">
			<section class="col-lg-8">
				<div class="card border-success-subtle shadow-sm game-card h-100">
					<div class="card-body p-4">
						<div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
					<ModeBadge mode={$currentGame.mode} />
							<div class="badge text-bg-dark border border-success-subtle fs-6">{remainingSeconds}s</div>
						</div>

						<div class="mt-4">
							<p class="text-uppercase small fw-semibold text-success mb-2">
								Bild {$currentGame.roundIndex + 1} / {$currentGame.images.length}
							</p>
							<h2 class="h3">{round.title}</h2>
							<p class="text-body-secondary mb-2">{round.description}</p>
							<p class="small text-success-emphasis mb-0">{round.hint}</p>
						</div>

						<div class="art-frame mt-4">
							<img class="img-fluid w-100 h-100 object-fit-cover" src={round.imageUrl} alt={round.title} />
						</div>
					</div>
				</div>
			</section>

			<section class="col-lg-4">
				<div class="card border-success-subtle shadow-sm game-card h-100">
					<div class="card-body p-4 d-flex flex-column">
						<h3 class="h4">Map und Guess</h3>
						<p class="text-body-secondary">
							Setze deinen Pin auf die Deadlock-Map. Je naeher dein Guess, desto hoeher der
							Score.
						</p>

						<div class="mt-2">
							<DeadlockMap
								selectedGuess={selectedGuess}
								interactive
								onGuess={(point) => (selectedGuess = point)}
							/>
						</div>

						<div class="card bg-dark-subtle border-success-subtle mt-3">
							<div class="card-body py-3">
								{#if selectedGuess}
									<p class="mb-0 small">Dein Pin: X {selectedGuess.x}% · Y {selectedGuess.y}%</p>
								{:else}
									<p class="mb-0 small text-body-secondary">
										Noch kein Pin gesetzt. Klick auf die Karte, um deine Vermutung zu platzieren.
									</p>
								{/if}
							</div>
						</div>

						<div class="d-grid gap-2 mt-auto pt-3">
							<button class="btn btn-success" type="button" onclick={() => void submitGuess()}>Guess bestaetigen</button>
							<button class="btn btn-outline-success" type="button" onclick={() => void submitGuess()}>
								Ueberspringen
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	{:else}
		<section class="card border-success-subtle shadow-sm game-card">
			<div class="card-body p-4">
				<p class="text-uppercase small fw-semibold text-success mb-2">Runde abgeschlossen</p>
				<h2 class="h3">{$currentGame.finalScore} Gesamtpunkte</h2>
				<p class="text-body-secondary">
					Deine Scores wurden gespeichert und fliessen jetzt sowohl ins Profil als auch in die
					Highscore-Ansicht ein.
				</p>
				{#if saveError}
					<div class="alert alert-warning py-2">{saveError}</div>
				{/if}

				<div class="row g-3 my-1">
				{#each $currentGame.results as result, index}
						<div class="col-md-4">
							<div class="card bg-dark-subtle border-success-subtle h-100">
								<div class="card-body">
									<strong>#{index + 1} {result.imageTitle}</strong>
									<p class="mb-1 mt-2">{result.score} Punkte</p>
									<span class="small text-body-secondary">Distanz: {result.distance}</span>
								</div>
							</div>
						</div>
				{/each}
				</div>

				<div class="d-flex gap-2 flex-wrap mt-4">
					<button class="btn btn-success" type="button" onclick={() => goto('/app/profile')}>
					Zum Profil
				</button>
					<button class="btn btn-outline-success" type="button" onclick={leaveGame}>Neue Runde bauen</button>
				</div>
			</div>
		</section>
	{/if}
{/if}

<style>
	.art-frame {
		border-radius: 1.4rem;
		overflow: hidden;
		min-height: 32rem;
	}

	.game-card {
		background: rgba(8, 17, 12, 0.9);
	}
</style>
