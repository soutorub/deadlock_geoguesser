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

		if (result.finished && timerHandle) {
			clearInterval(timerHandle);
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
		<div class="game-grid">
			<section class="app-panel-card game-panel game-main-panel">
				<div class="game-topline">
					<ModeBadge mode={$currentGame.mode} />
					<div class="badge text-bg-dark border border-success-subtle fs-6">{remainingSeconds}s</div>
				</div>

				<div class="game-copy-block">
					<p class="app-eyebrow">Bild {$currentGame.roundIndex + 1} / {$currentGame.images.length}</p>
					<h2 class="game-title">{round.name}</h2>
				</div>

				<div class="art-frame">
					<img class="img-fluid w-100 h-100 object-fit-cover" src={round.imageUrl} alt={round.name} />
				</div>
			</section>

			<section class="app-panel-card game-panel game-side-panel">
				<div>
					<h3 class="game-side-title">Map und Guess</h3>
					<p class="game-side-copy">
						Setze deinen Pin auf die Deadlock-Map. Je näher dein Guess, desto höher der Score.
					</p>
				</div>

				<div class="game-map-wrap">
					<DeadlockMap
						selectedGuess={selectedGuess}
						interactive
						onGuess={(point) => (selectedGuess = point)}
					/>
				</div>

				<div class="app-stat-card game-pin-card">
					{#if selectedGuess}
						<p class="mb-0">Dein Pin: X {selectedGuess.x}% · Y {selectedGuess.y}%</p>
					{:else}
						<p class="mb-0 text-body-secondary">
							Noch kein Pin gesetzt. Klick auf die Karte, um deine Vermutung zu platzieren.
						</p>
					{/if}
				</div>

				<div class="game-action-group">
					<button class="btn btn-success w-100" type="button" onclick={() => void submitGuess()}>
						Guess bestätigen
					</button>
					<button class="btn btn-outline-success w-100" type="button" onclick={() => void submitGuess()}>
						Überspringen
					</button>
				</div>
			</section>
		</div>
	{:else}
		<section class="app-panel-card game-finished-panel">
			<p class="app-eyebrow">Runde abgeschlossen</p>
			<h2 class="app-section-title">{$currentGame.finalScore} Gesamtpunkte</h2>
			<p class="app-copy">
				Deine Scores wurden gespeichert und fliessen jetzt sowohl ins Profil als auch in die
				Highscore-Ansicht ein.
			</p>
			{#if saveError}
				<div class="alert alert-warning py-2">{saveError}</div>
			{/if}

			<div class="game-results-grid">
				{#each $currentGame.results as result, index}
					<div class="app-stat-card game-result-card">
						<strong>#{index + 1} {result.imageName}</strong>
						<p>{result.score} Punkte</p>
						<span class="text-body-secondary">Distanz: {result.distance}</span>
					</div>
				{/each}
			</div>

			<div class="game-finished-actions">
				<button class="btn btn-success" type="button" onclick={() => goto('/app/profile')}>Zum Profil</button>
				<button class="btn btn-outline-success" type="button" onclick={leaveGame}>Neue Runde bauen</button>
			</div>
		</section>
	{/if}
{/if}

<style>
	.game-grid {
		display: grid;
		grid-template-columns: 56% 44%;
		gap: 1rem;
		align-items: stretch;
	}

	.game-panel,
	.game-finished-panel {
		padding: 1.45rem;
	}

	.game-main-panel {
		display: grid;
		gap: 1.35rem;
	}

	.game-topline {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.game-copy-block {
		display: grid;
		gap: 0.6rem;
	}

	.game-title {
		font-size: 2rem;
		margin: 0;
	}

	.art-frame {
		border-radius: 0;
		overflow: hidden;
		height: clamp(28rem, 54vh, 40rem);
		max-height: 40rem;
		border: 1px solid rgba(209, 232, 183, 0.12);
	}

	.game-side-panel {
		display: grid;
		align-content: start;
		gap: 1rem;
	}

	.game-side-title {
		font-size: 1.9rem;
		margin: 0 0 0.5rem;
	}

	.game-side-copy {
		margin: 0;
		font-size: 1.08rem;
		color: var(--app-muted);
		line-height: 1.45;
	}

	.game-map-wrap {
		display: grid;
		width: 100%;
	}

	.game-pin-card {
		padding: 1rem 1.1rem;
		font-size: 1rem;
	}

	.game-action-group {
		display: grid;
		gap: 0.8rem;
		margin-top: auto;
	}

	.game-results-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin: 1.5rem 0;
	}

	.game-result-card {
		padding: 1.1rem;
		display: grid;
		gap: 0.55rem;
	}

	.game-result-card p,
	.game-result-card span {
		margin: 0;
	}

	.game-finished-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
	}

	:global(.game-map-wrap .map) {
		min-height: 780px;
		width: 100%;
	}

	:global(.game-map-wrap .sector) {
		font-size: 0.96rem;
		padding: 0.45rem 0.65rem;
	}

	:global(.game-map-wrap .marker) {
		width: 1.35rem;
		height: 1.35rem;
	}

	:global(.game-map-wrap .marker span) {
		top: 1.6rem;
		font-size: 0.82rem;
	}

	@media (max-width: 1200px) {
		.game-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 820px) {
		.game-panel,
		.game-finished-panel {
			padding: 1.2rem;
		}

		.art-frame {
			height: clamp(22rem, 42vh, 28rem);
			max-height: 28rem;
		}

		:global(.game-map-wrap .map) {
			min-height: 480px;
		}

		.game-results-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
