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
		<section class="app-panel-card landing-panel">
			<div>
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

		<section class="app-panel-card landing-panel">
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
	.landing-page {
		height: 100vh;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.landing-frame {
		width: 80%;
		height: 50%;
		display: grid;
		grid-template-columns: 58% 42%;
		gap: 1.5rem;
	}

	.landing-panel {
		padding: 3rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.landing-title {
			margin: 0 0 1.5rem;
			max-width: none;
		}

		.landing-copy {
			font-size: 1.5rem;
			color: var(--app-muted);
		}

		.landing-feature-grid {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 1.25rem;
			align-items: stretch;
		}

		.landing-feature-card {
			padding: 1rem;
			display: grid;
			align-content: start;
			gap: 1rem;

			h2, p {
				word-break: break-all;
			}
		}

		.landing-switch {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 0.6rem;
		}

		.landing-switch-button {
			min-height: 4rem;
			border: 1px solid var(--app-line);
			background: #0b0f0c;
			color: var(--app-text);
			font-size: 1.3rem;
			font-weight: 600;

			&.active {
				background: rgba(var(--bs-success-rgb), 0.18);
				border-color: rgba(var(--bs-success-rgb), 0.65);
			}
		}

		.landing-form {
			margin-top: 1rem;
			display: grid;
			gap: 1.4rem;

			.landing-field {
				display: grid;
				gap: 0.5rem;

				input {
					background: var(--app-muted);
					color: black !important;
				}

				label {
					color: var(--bs-body-color);
					font-size: 1.18rem;
					font-weight: 600;
				}
			}
		}

		.landing-demo-card {
			padding: 1.7rem;
			margin-top: auto;

			.landing-demo-title {
				font-size: 1.3rem;
				font-weight: 700;
				margin-bottom: 0.4rem;
			}

			.landing-demo-copy {
				font-size: 1.18rem;
				color: var(--app-muted);
			}
		}
	}
</style>
