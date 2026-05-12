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

<div class="container min-vh-100 d-flex align-items-center py-5">
	<div class="row g-4 w-100">
		<div class="col-lg-7">
			<div class="card border-success-subtle shadow-sm h-100 auth-panel">
				<div class="card-body p-4 p-xl-5">
					<p class="text-uppercase small fw-semibold text-success mb-2">Semester 4 Prototype</p>
					<h1 class="display-4 fw-bold mb-3">Deadlock GeoGuesser</h1>
					<p class="lead text-body-secondary mb-4">
						Logge dich ein oder erstelle einen Account. Danach startest du Deadlock-Runden
						mit frei waehlbarer Bildanzahl und Timer.
					</p>

					<div class="row g-3">
						<div class="col-md-4">
							<div class="card h-100 border-success-subtle bg-dark-subtle">
								<div class="card-body">
									<h2 class="h6">Spielmodi</h2>
									<p class="small mb-0 text-body-secondary">5, 10, 20 oder 30 Bilder mit 10, 30 oder 60 Sekunden.</p>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="card h-100 border-success-subtle bg-dark-subtle">
								<div class="card-body">
									<h2 class="h6">Guessing</h2>
									<p class="small mb-0 text-body-secondary">Map aufklappen, Pin setzen und ueber Distanz Punkte erhalten.</p>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="card h-100 border-success-subtle bg-dark-subtle">
								<div class="card-body">
									<h2 class="h6">Highscores</h2>
									<p class="small mb-0 text-body-secondary">Profil- und globale Scores getrennt nach Spielmodus.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="col-lg-5">
			<div class="card border-success-subtle shadow-sm auth-panel">
				<div class="card-body p-4">
					<ul class="nav nav-pills nav-fill mb-4">
						<li class="nav-item">
							<button
								class:active={mode === 'login'}
								class="nav-link text-light border border-success-subtle"
								type="button"
								onclick={() => (mode = 'login')}
							>
								Login
							</button>
						</li>
						<li class="nav-item">
							<button
								class:active={mode === 'signup'}
								class="nav-link text-light border border-success-subtle"
								type="button"
								onclick={() => (mode = 'signup')}
							>
								Sign up
							</button>
						</li>
					</ul>

					<form class="d-grid gap-3" onsubmit={handleFormSubmit}>
						{#if mode === 'signup'}
							<div>
								<label class="form-label" for="signup-username">Username</label>
								<input id="signup-username" class="form-control" bind:value={username} minlength="3" placeholder="z.B. RubenScout" required />
							</div>
						{/if}

						<div>
							<label class="form-label" for="auth-email">E-Mail</label>
							<input id="auth-email" class="form-control" bind:value={email} type="email" placeholder="du@prototype.gg" required />
						</div>

						<div>
							<label class="form-label" for="auth-password">Passwort</label>
							<input id="auth-password" class="form-control" bind:value={password} type="password" minlength="6" placeholder="mindestens 6 Zeichen" required />
						</div>

						<button class="btn btn-success" type="submit" disabled={submitting}>
							{mode === 'login' ? 'Einloggen' : 'Account erstellen'}
						</button>

						{#if message}
							<div class="alert alert-success py-2 mb-0">{message}</div>
						{/if}
					</form>

					<div class="card mt-4 border-success-subtle bg-dark-subtle">
						<div class="card-body py-3">
							<div class="fw-semibold">Demo-Account</div>
							<div class="small text-body-secondary">
								<code>ruben@prototype.gg</code> / <code>deadlock123</code>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
	}

	.auth-panel {
		background: rgba(8, 17, 12, 0.9);
	}
</style>
