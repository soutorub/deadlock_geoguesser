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
			<div class="shell-title-block">
				<p class="app-eyebrow">Deadlock GeoGuesser</p>
				<h1 class="shell-title">Tactical Round Console</h1>
			</div>

			{#if $activeUser}
				<div class="shell-user-panel">
					{#if isActiveRound}
						<div class="shell-user-link">
							<div class="shell-avatar">{$activeUser.avatar}</div>
							<div>
								<div class="shell-user-name">{$activeUser.username}</div>
								<div class="shell-user-mail">{$activeUser.email}</div>
							</div>
						</div>
					{:else}
						<a class="shell-user-link" href="/app/profile">
							<div class="shell-avatar">{$activeUser.avatar}</div>
							<div>
								<div class="shell-user-name">{$activeUser.username}</div>
								<div class="shell-user-mail">{$activeUser.email}</div>
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
		width: calc(100vw - 1rem);
		margin: 0 auto;
		padding: 0.5rem;
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
		padding: 1.1rem 1.15rem;
	}

	.shell-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.25rem;
	}

	.shell-title {
		font-size: clamp(2.7rem, 2vw + 1.6rem, 4rem);
		line-height: 0.95;
		letter-spacing: -0.03em;
		margin: 0;
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
		gap: 0.85rem;
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

	.shell-user-name {
		font-size: 1.18rem;
		font-weight: 700;
	}

	.shell-user-mail {
		font-size: 1.04rem;
		color: var(--app-muted);
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
		min-height: 3.55rem;
		padding: 1rem 1.3rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--app-line);
		background: #0b0f0c;
		color: var(--app-text);
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 1.08rem;
		font-weight: 700;
	}

	.shell-nav-link.active {
		background: rgba(var(--bs-success-rgb), 0.16);
		border-color: rgba(var(--bs-success-rgb), 0.55);
		color: #eff5e8;
	}

	.shell-content {
		font-size: 1rem;
	}

	@media (max-width: 820px) {
		.shell-stage {
			width: min(96vw, 1500px);
			padding: 1rem;
			min-height: auto;
			display: block;
		}

		.shell-frame {
			padding: 1rem;
		}

		.shell-user-panel {
			width: 100%;
			justify-content: space-between;
		}

		.shell-nav {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
