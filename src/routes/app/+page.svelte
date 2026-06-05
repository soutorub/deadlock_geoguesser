<svelte:options runes={false} />

<script lang="ts">
	import { goto } from '$app/navigation';
	import ModeBadge from '$lib/components/ModeBadge.svelte';
	import { appStore, currentGame } from '$lib/stores/app-store';
	import type { RoundCount, TimerSeconds } from '$lib/types';

	let roundCount: RoundCount = 5;
	let timerSeconds: TimerSeconds = 10;
	let starting = false;

	const roundOptions: RoundCount[] = [5, 10, 20, 30];
	const timerOptions: TimerSeconds[] = [10, 30, 60];

	async function startGame() {
		starting = true;
		await appStore.startGame({ roundCount, timerSeconds });
		starting = false;
		goto('/app/game');
	}
</script>

<svelte:head>
	<title>Spiel starten | Deadlock GeoGuesser</title>
</svelte:head>

<div class="home-grid">
	<div class="home-main-column">
		<section class="app-panel-card home-panel">
			<p class="app-eyebrow">Home</p>
			<h2 class="app-section-title">Neue Runde konfigurieren</h2>
			<p class="app-copy home-copy">
				Wähle Bildanzahl und Timer. Nach dem Spiel wird der Score automatisch im Profil und
				Leaderboard gespeichert.
			</p>

			<div class="home-stats">
				<div class="app-stat-card home-stat">
					<div class="home-stat-value">12</div>
					<div class="home-stat-label">Spielarten</div>
				</div>
				<div class="app-stat-card home-stat">
					<div class="home-stat-value">30</div>
					<div class="home-stat-label">Deadlock Bilder</div>
				</div>
				<div class="app-stat-card home-stat">
					<div class="home-stat-value">5000</div>
					<div class="home-stat-label">Max Punkte pro Bild</div>
				</div>
			</div>
		</section>

		<section class="app-panel-card home-panel">
			<h3 class="home-subtitle">So läuft eine Runde ab</h3>
			<div class="home-steps">
				<div class="home-step">
					<div class="home-step-index">1. Modus wählen</div>
					<div class="home-step-text">Bilderanzahl und Timer separat festlegen.</div>
				</div>
				<div class="home-step">
					<div class="home-step-index">2. Orte raten</div>
					<div class="home-step-text">Pin auf der Deadlock-Map setzen und Punkte sammeln.</div>
				</div>
				<div class="home-step">
					<div class="home-step-index">3. Scores vergleichen</div>
					<div class="home-step-text">Ergebnisse landen direkt im Profil und im Leaderboard.</div>
				</div>
			</div>
		</section>
	</div>

	<aside class="app-panel-card home-panel home-side-panel">
		<div class="home-option-group">
			<div class="home-option-label">Bilder pro Runde</div>
			<div class="home-option-row">
				{#each roundOptions as option}
					<button
						type="button"
						class:selected={roundCount === option}
						class="btn border-success-subtle text-light home-chip"
						onclick={() => (roundCount = option)}
					>
						{option}
					</button>
				{/each}
			</div>
		</div>

		<div class="home-option-group">
			<div class="home-option-label">Timer pro Bild</div>
			<div class="home-option-row">
				{#each timerOptions as option}
					<button
						type="button"
						class:selected={timerSeconds === option}
						class="btn border-success-subtle text-light home-chip"
						onclick={() => (timerSeconds = option)}
					>
						{option === 60 ? '1 min' : `${option} sek`}
					</button>
				{/each}
			</div>
		</div>

		<div class="app-stat-card home-mode-card">
			<ModeBadge mode={{ roundCount, timerSeconds }} />
			<p class="home-mode-copy">
				Kompakte Auswahl für deinen Prototypen mit klar getrennten Modi.
			</p>
		</div>

		<div class="home-action-group">
			<button class="btn btn-success w-100" type="button" onclick={startGame} disabled={starting}>
				Spiel starten
			</button>

			{#if $currentGame}
				<a class="btn btn-outline-success w-100" href="/app/game">Laufendes Spiel fortsetzen</a>
			{/if}
		</div>
	</aside>
</div>

<style>
	.home-grid {
		display: grid;
		grid-template-columns: 60% 40%;
		gap: 1.35rem;
		align-items: stretch;
	}

	.home-main-column {
		display: grid;
		gap: 1.35rem;
	}

	.home-panel {
		padding: 1.8rem;
	}

	.home-copy {
		max-width: 42rem;
		margin-bottom: 1.4rem;
	}

	.home-stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.9rem;
	}

	.home-stat {
		padding: 1.1rem;
	}

	.home-stat-value {
		font-size: clamp(2rem, 1.6vw + 1rem, 3rem);
		line-height: 1;
		font-weight: 800;
		color: var(--app-accent);
		margin-bottom: 0.45rem;
	}

	.home-stat-label {
		font-size: 1rem;
		color: var(--app-muted);
	}

	.home-subtitle {
		font-size: 1.7rem;
		margin: 0 0 1rem;
	}

	.home-steps {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.home-step-index {
		font-size: 1rem;
		color: var(--app-muted);
		margin-bottom: 0.4rem;
	}

	.home-step-text {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.4;
	}

	.home-side-panel {
		display: grid;
		align-content: start;
		gap: 1.5rem;
	}

	.home-option-group {
		display: grid;
		gap: 0.7rem;
	}

	.home-option-label {
		font-size: 1rem;
		font-weight: 700;
	}

	.home-option-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}

	.home-chip {
		min-width: 5rem;
	}

	.home-chip.selected {
		background-color: rgba(199, 211, 111, 0.18);
		color: #eff5e8;
		border-color: rgba(199, 211, 111, 0.55);
	}

	.home-mode-card {
		padding: 1.2rem;
		display: grid;
		gap: 0.75rem;
	}

	.home-mode-copy {
		margin: 0;
		font-size: 1rem;
		color: var(--app-muted);
	}

	.home-action-group {
		display: grid;
		gap: 0.75rem;
	}
</style>
