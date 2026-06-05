<svelte:options runes={false} />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { activeUser, appStore, currentGame } from '$lib/stores/app-store';

	const navItems = [
		{ href: '/app', label: 'Spiel starten' },
		{ href: '/app/leaderboard', label: 'Highscores' }
	];

	$: isActiveRound = $page.url.pathname === '/app/game' && $currentGame?.status === 'playing';
	$: isGameView = $page.url.pathname === '/app/game';

	function abortActiveRound() {
		appStore.resetGame();
		goto('/app');
	}
</script>

<div class:game-stage={isGameView} class="shell-stage">
	<div class:game-frame={isGameView} class="app-panel-card shell-frame">
		<header class="shell-header">
			<div>
				<p class="app-eyebrow">Deadlock GeoGuesser</p>
				<h1 >Tactical Round Console</h1>
			</div>

			{#if $activeUser}
				<div class="shell-user-panel">
					{#if isActiveRound}
						<div class="shell-user-link">
							<div class="shell-avatar">{$activeUser.avatar}</div>
							<div>
								<div>{$activeUser.username}</div>
								<div>{$activeUser.email}</div>
							</div>
						</div>
					{:else}
						<a class="shell-user-link" href="/app/profile">
							<div class="shell-avatar">{$activeUser.avatar}</div>
							<div>
								<div>{$activeUser.username}</div>
								<div>{$activeUser.email}</div>
							</div>
						</a>
					{/if}
					<button class="btn btn-outline-success" type="button" onclick={() => appStore.logout()}>
						Logout
					</button>
				</div>
			{/if}
		</header>

		{#if isActiveRound}
			<div class="shell-nav">
				<button class="btn btn-outline-success shell-abort-button" type="button" onclick={abortActiveRound}>
					Abbrechen
				</button>
			</div>
		{:else}
			<nav class="shell-nav">
				{#each navItems as item}
					<a
						class:active={$page.url.pathname === item.href}
						class="shell-nav-link"
						href={item.href}
					>
						{item.label}
					</a>
				{/each}
			</nav>
		{/if}

		<div class="shell-content">
			<slot />
		</div>
	</div>
</div>

<style>
	.shell-stage {
		min-height: 100vh;
		display: flex;
		align-items: center;
	}

	.shell-frame {
		width: 100%;
		padding: 1.4rem 1.5rem;
	}

	.shell-stage.game-stage {
		width: calc(100vw - 0.35rem);
		max-width: none;
		padding: 0.2rem;
	}

	.shell-frame.game-frame {
		padding: 1rem 1.2rem;
	}

	.shell-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.3rem;
	}

	.shell-user-panel {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.15rem 1.25rem;
		border: 1px solid var(--app-line);
		background: var(--app-panel-soft);
	}

	.shell-user-link {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		text-decoration: none;
		color: inherit;
	}

	.shell-avatar {
		width: 4rem;
		height: 4rem;
		display: grid;
		place-items: center;
		background: var(--app-accent-soft);
		color: #0b0e0c;
		font-size: 1.45rem;
		font-weight: 800;
		border: 1px solid rgba(11, 14, 12, 0.45);
	}

	.shell-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-bottom: 1.5rem;
	}

	.shell-abort-button {
		min-width: 12rem;
	}

	.shell-nav-link {
		padding: 1rem 1.3rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--app-line);
		background: #0b0f0c;
		color: var(--app-text);
		text-decoration: none;
		text-transform: uppercase;
		font-size: 1rem;
		font-weight: 700;

		&.active {
			background: rgba(var(--bs-success-rgb), 0.16);
			border-color: rgba(var(--bs-success-rgb), 0.55);
			color: #eff5e8;
		}
	}
</style>
