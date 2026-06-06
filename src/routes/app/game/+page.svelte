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
					<div class="game-timer-badge">{remainingSeconds}s</div>
				</div>

				<div class="game-copy-block">
					<p class="app-eyebrow game-round-index">Bild {$currentGame.roundIndex + 1} / {$currentGame.images.length}</p>
					<h2>Bild {$currentGame.roundIndex + 1}</h2>
				</div>

				<div class="art-frame">
					<img class="art-image" src={round.imageUrl} alt={`Bild ${$currentGame.roundIndex + 1}`} />
				</div>
			</section>

			<section class="app-panel-card game-panel game-side-panel">
				<div>
					<h3>Map und Guess</h3>
					<p class="game-map-intro">
						Setze deinen Pin auf die Deadlock-Map. Je näher dein Guess, desto höher der Score.
					</p>
				</div>

				<div>
					<DeadlockMap
						selectedGuess={selectedGuess}
						interactive
						onGuess={(point) => (selectedGuess = point)}
					/>
				</div>

				<div class="app-stat-card game-pin-card">
					{#if selectedGuess}
						<p class="game-pin-copy">Dein Pin: X {selectedGuess.x}% · Y {selectedGuess.y}%</p>
					{:else}
						<p class="game-pin-copy game-pin-empty">
							Noch kein Pin gesetzt. Klick auf die Karte, um deine Vermutung zu platzieren.
						</p>
					{/if}
				</div>

				<div class="game-action-group">
					<button class="btn btn-success app-button-block" type="button" onclick={() => void submitGuess()}>
						Guess bestätigen
					</button>
					<button class="btn btn-outline-success app-button-block" type="button" onclick={() => void submitGuess()}>
						Überspringen
					</button>
				</div>
			</section>
		</div>
	{:else}
		<section class="app-panel-card game-finished-panel">
			<p class="app-eyebrow">Runde abgeschlossen</p>
			<h2>{$currentGame.finalScore} Gesamtpunkte</h2>
			<p class="game-finished-copy">
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
						<span class="game-result-meta">Distanz: {result.distance}</span>
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
		grid-template-columns: 50% 50%;
		gap: 1.15rem;
		align-items: stretch;
	}

	.game-panel,
	.game-finished-panel {
		padding: 1.45rem;
	}

	.game-main-panel {
		display: grid;
		gap: 1.35rem;

		.art-frame {
			border: 1px solid var(--app-color-border-soft);
			display: grid;
			place-items: center;
		}

		.art-image {
			width: 100%;
			height: 100%;
		}
	}

	.game-topline {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.game-timer-badge {
		padding: 0.45rem 0.7rem;
		border: 1px solid var(--app-color-accent-border-strong);
		background: var(--app-color-surface-deep);
		font-size: 2rem;
		font-weight: 700;
	}

	.game-copy-block {
		display: grid;
		gap: 0.6rem;

		h2 {
			margin: 0;
		}
	}

	.game-round-index {
		margin: 0;
	}

	.game-side-panel {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1.35rem;
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

	.game-result-meta {
		color: var(--app-color-text-muted);
	}

	.game-finished-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
	}
</style>
