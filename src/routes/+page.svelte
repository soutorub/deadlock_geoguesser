<svelte:options runes={false} />

<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { activeUser, appStore } from '$lib/stores/app-store';

	let mode: 'login' | 'signup' = 'login';
	let email = '';
	let password = '';
	let username = '';
	let message = '';
	let submitting = false;

	$: if (browser && $activeUser) {
		goto('/app');
	}

	async function handleSubmit() {
		submitting = true;
		const result =
			mode === 'login'
				? await appStore.login(email, password)
				: await appStore.signup(email, password, username.trim());

		message = result.message;
		submitting = false;

		if (result.success) {
			goto('/app');
		}
	}

	async function handleFormSubmit(event: SubmitEvent) {
		event.preventDefault();
		await handleSubmit();
	}
</script>

<svelte:head>
	<title>Login | Deadlock GeoGuesser</title>
</svelte:head>

<div class="landing-page">
	<div class="landing-frame">
		<section class="app-panel-card landing-panel landing-hero">
			<div class="landing-hero-copy">
				<p class="app-eyebrow">Semester 4 Prototype</p>
				<h1 class="landing-title">Deadlock GeoGuesser</h1>
				<p class="landing-copy">
					Logge dich ein oder erstelle einen Account. Danach startest du Deadlock-Runden
					mit frei wählbarer Bildanzahl und Timer.
				</p>
			</div>

			<div class="landing-feature-grid">
				<article class="app-stat-card landing-feature-card">
					<h2>Spielmodi</h2>
					<p>5, 10, 20 oder 30 Bilder mit 10, 30 oder 60 Sekunden.</p>
				</article>
				<article class="app-stat-card landing-feature-card">
					<h2>Guessing</h2>
					<p>Map aufklappen, Pin setzen und über Distanz Punkte erhalten.</p>
				</article>
				<article class="app-stat-card landing-feature-card">
					<h2>Highscores</h2>
					<p>Profil- und globale Scores getrennt nach Spielmodus vergleichen.</p>
				</article>
			</div>
		</section>

		<section class="app-panel-card landing-panel landing-form-panel">
			<div class="landing-switch">
				<button
					class:active={mode === 'login'}
					class="landing-switch-button"
					type="button"
					onclick={() => (mode = 'login')}
				>
					Login
				</button>
				<button
					class:active={mode === 'signup'}
					class="landing-switch-button"
					type="button"
					onclick={() => (mode = 'signup')}
				>
					Sign up
				</button>
			</div>

			<form class="landing-form" onsubmit={handleFormSubmit}>
				{#if mode === 'signup'}
					<div class="landing-field">
						<label for="signup-username">Username</label>
						<input
							id="signup-username"
							class="form-control"
							bind:value={username}
							minlength="3"
							placeholder="z.B. RubenScout"
							required
						/>
					</div>
				{/if}

				<div class="landing-field">
					<label for="auth-email">E-Mail</label>
					<input
						id="auth-email"
						class="form-control"
						bind:value={email}
						type="email"
						placeholder="du@prototype.gg"
						required
					/>
				</div>

				<div class="landing-field">
					<label for="auth-password">Passwort</label>
					<input
						id="auth-password"
						class="form-control"
						bind:value={password}
						type="password"
						minlength="6"
						placeholder="mindestens 6 Zeichen"
						required
					/>
				</div>

				<button class="btn btn-success w-100" type="submit" disabled={submitting}>
					{mode === 'login' ? 'Einloggen' : 'Account erstellen'}
				</button>

				{#if message}
					<div class="alert alert-success py-2 mb-0">{message}</div>
				{/if}
			</form>

			<div class="app-stat-card landing-demo-card">
				<div class="landing-demo-title">Demo-Account</div>
				<div class="landing-demo-copy">
					<code>ruben@prototype.gg</code> / <code>deadlock123</code>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	.landing-page {
		min-height: 100vh;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.9rem;
	}

	.landing-frame {
		width: min(92vw, 1960px);
		min-height: min(86vh, 1080px);
		display: grid;
		grid-template-columns: 58% 42%;
		gap: 1.6rem;
		align-items: stretch;
	}

	.landing-panel {
		padding: 2.8rem 3rem;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	}

	.landing-hero {
		justify-content: space-between;
	}

	.landing-hero-copy {
		max-width: none;
		padding-right: 3rem;
	}

	.landing-title {
		font-size: clamp(6rem, 6.3vw, 8.6rem);
		line-height: 0.92;
		letter-spacing: -0.05em;
		margin: 0 0 1.5rem;
		max-width: none;
	}

	.landing-copy {
		font-size: clamp(1.6rem, 1.1vw + 1.1rem, 2.05rem);
		line-height: 1.5;
		color: var(--app-muted);
		margin: 0;
		max-width: 42rem;
	}

	.landing-feature-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
		margin-top: 3.2rem;
		align-items: stretch;
	}

	.landing-feature-card {
		padding: 2rem 2rem;
		display: grid;
		align-content: start;
		gap: 1.05rem;
		min-height: clamp(18rem, 30vh, 23rem);
	}

	.landing-feature-card h2 {
		font-size: 1.45rem;
		margin: 0;
	}

	.landing-feature-card p {
		font-size: 1.24rem;
		line-height: 1.5;
		color: var(--app-muted);
		margin: 0;
		max-width: none;
	}

	.landing-form-panel {
		justify-content: flex-start;
		gap: 2rem;
	}

	.landing-form-panel .landing-form,
	.landing-form-panel .landing-switch,
	.landing-form-panel .landing-demo-card {
		width: 100%;
		max-width: none;
	}

	.landing-switch {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.55rem;
	}

	.landing-switch-button {
		min-height: 4.4rem;
		border: 1px solid var(--app-line);
		background: #0b0f0c;
		color: var(--app-text);
		font-size: 1.32rem;
		font-weight: 600;
	}

	.landing-switch-button.active {
		background: rgba(var(--bs-success-rgb), 0.18);
		border-color: rgba(var(--bs-success-rgb), 0.65);
		color: #eff5e8;
	}

	.landing-form {
		display: grid;
		gap: 1.4rem;
	}

	.landing-field {
		display: grid;
		gap: 0.5rem;
	}

	.landing-field label {
		font-size: 1.18rem;
		font-weight: 600;
	}

	.landing-demo-card {
		padding: 1.7rem;
		margin-top: auto;
	}

	.landing-demo-title {
		font-size: 1.3rem;
		font-weight: 700;
		margin-bottom: 0.4rem;
	}

	.landing-demo-copy {
		font-size: 1.18rem;
		color: var(--app-muted);
	}

	@media (max-width: 1180px) {
		.landing-frame {
			width: calc(100vw - 2rem);
			grid-template-columns: 1fr;
			min-height: auto;
		}

		.landing-title {
			max-width: none;
			font-size: clamp(4.8rem, 7vw, 6.8rem);
		}
	}

	@media (max-width: 760px) {
		.landing-page {
			padding: 1rem;
		}

		.landing-panel {
			padding: 1.1rem;
		}

		.landing-feature-grid {
			grid-template-columns: 1fr;
		}

		.landing-title {
			font-size: clamp(3.8rem, 10vw, 5rem);
		}

		.landing-copy {
			font-size: 1.2rem;
		}
	}
</style>
