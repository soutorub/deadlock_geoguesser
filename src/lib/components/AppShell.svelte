<svelte:options runes={false} />

<script lang="ts">
	import { page } from '$app/stores';
	import { activeUser, appStore } from '$lib/stores/app-store';

	const navItems = [
		{ href: '/app', label: 'Spiel starten' },
		{ href: '/app/leaderboard', label: 'Highscores' }
	];
</script>

<div class="container py-4">
	<div class="card shadow-sm border-success-subtle app-shell">
		<div class="card-body p-3 p-lg-4">
			<div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
				<div>
					<p class="text-uppercase small fw-semibold text-success mb-1">Deadlock GeoGuesser</p>
					<h1 class="h2 mb-0">Prototype Control Room</h1>
				</div>

				{#if $activeUser}
					<div class="d-flex align-items-center gap-3 bg-dark-subtle rounded-4 px-3 py-2 border border-success-subtle">
						<a class="profile-link d-flex align-items-center gap-3 text-decoration-none text-reset" href="/app/profile">
							<div class="avatar">{$activeUser.avatar}</div>
							<div>
								<div class="fw-semibold">{$activeUser.username}</div>
								<div class="small text-body-secondary">{$activeUser.email}</div>
							</div>
						</a>
						<button class="btn btn-outline-success btn-sm" type="button" onclick={() => appStore.logout()}>
							Logout
						</button>
					</div>
				{/if}
			</div>

			<ul class="nav nav-pills gap-2 mb-4">
				{#each navItems as item}
					<li class="nav-item">
						<a
							class:active={$page.url.pathname === item.href}
							class="nav-link text-light border border-success-subtle"
							href={item.href}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>

			<div class="content">
		<slot />
			</div>
		</div>
	</div>
</div>

<style>
	.avatar {
		width: 2.7rem;
		height: 2.7rem;
		display: grid;
		place-items: center;
		border-radius: 999px;
		background: linear-gradient(135deg, #3ddc84, #89f7b5);
		color: #07100b;
		font-weight: 700;
	}

	.app-shell {
		background: rgba(8, 17, 12, 0.9);
		backdrop-filter: blur(10px);
	}

	.nav-link.active {
		background-color: rgba(61, 220, 132, 0.18);
		color: #caffdb !important;
	}

	.profile-link:hover .fw-semibold,
	.profile-link:hover .text-body-secondary {
		color: #caffdb !important;
	}
</style>
