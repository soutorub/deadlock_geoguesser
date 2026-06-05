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

<div class="row g-4">
	<div class="col-lg-7">
		<div class="d-grid gap-4">
			<div class="card border-success-subtle shadow-sm dashboard-card">
				<div class="card-body p-4">
					<p class="text-uppercase small fw-semibold text-success mb-2">Home</p>
					<h2 class="h3 mb-3">Neue Runde konfigurieren</h2>
					<p class="text-body-secondary mb-4">
						Wähle Bildanzahl und Timer. Nach dem Spiel wird der Score automatisch im Profil und
						Leaderboard gespeichert.
					</p>

					<div class="row g-3">
						<div class="col-md-4">
							<div class="card bg-dark-subtle border-success-subtle h-100">
								<div class="card-body">
									<div class="display-6 fw-bold text-success">12</div>
									<div class="small text-body-secondary">Spielarten</div>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="card bg-dark-subtle border-success-subtle h-100">
								<div class="card-body">
									<div class="display-6 fw-bold text-success">30</div>
									<div class="small text-body-secondary">Deadlock Bilder</div>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="card bg-dark-subtle border-success-subtle h-100">
								<div class="card-body">
									<div class="display-6 fw-bold text-success">5000</div>
									<div class="small text-body-secondary">Max Punkte pro Bild</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="card border-success-subtle shadow-sm dashboard-card">
				<div class="card-body p-4">
					<h3 class="h5 mb-3">So läuft eine Runde ab</h3>
					<div class="row g-3">
						<div class="col-md-4">
							<div class="small text-body-secondary">1. Modus wählen</div>
							<div class="fw-semibold">Bilderanzahl und Timer separat festlegen.</div>
						</div>
						<div class="col-md-4">
							<div class="small text-body-secondary">2. Orte raten</div>
							<div class="fw-semibold">Pin auf der Deadlock-Map setzen und Punkte sammeln.</div>
						</div>
						<div class="col-md-4">
							<div class="small text-body-secondary">3. Scores vergleichen</div>
							<div class="fw-semibold">Ergebnisse landen direkt im Profil und im Leaderboard.</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="col-lg-5">
		<div class="card border-success-subtle shadow-sm dashboard-card">
			<div class="card-body p-4">
				<div class="mb-4">
					<div class="form-label fw-semibold">Bilder pro Runde</div>
					<div class="d-flex flex-wrap gap-2">
						{#each roundOptions as option}
							<button
								type="button"
								class:selected={roundCount === option}
								class="btn border-success-subtle text-light"
								onclick={() => (roundCount = option)}
							>
								{option}
							</button>
						{/each}
					</div>
				</div>

				<div class="mb-4">
					<div class="form-label fw-semibold">Timer pro Bild</div>
					<div class="d-flex flex-wrap gap-2">
						{#each timerOptions as option}
							<button
								type="button"
								class:selected={timerSeconds === option}
								class="btn border-success-subtle text-light"
								onclick={() => (timerSeconds = option)}
							>
								{option === 60 ? '1 min' : `${option} sek`}
							</button>
						{/each}
					</div>
				</div>

				<div class="card bg-dark-subtle border-success-subtle mb-4">
					<div class="card-body d-flex flex-column gap-2">
						<ModeBadge mode={{ roundCount, timerSeconds }} />
						<p class="small text-body-secondary mb-0">
							Kompakte Auswahl für deinen Bootstrap-Prototypen mit klar getrennten Modi.
						</p>
					</div>
				</div>

				<button class="btn btn-success w-100" type="button" onclick={startGame} disabled={starting}>Spiel starten</button>

				{#if $currentGame}
					<a class="btn btn-outline-success w-100 mt-2" href="/app/game">Laufendes Spiel fortsetzen</a>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.dashboard-card {
		background: rgba(8, 17, 12, 0.9);
	}

	.btn.selected {
		background-color: #3ddc84;
		color: #07100b;
	}
</style>
