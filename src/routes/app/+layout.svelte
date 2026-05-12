<svelte:options runes={false} />

<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import AppShell from '$lib/components/AppShell.svelte';
	import { appStore, isAuthenticated } from '$lib/stores/app-store';

	let ready = false;

	onMount(() => {
		(async () => {
			await appStore.init();
			ready = true;
		})();
	});

	$: if (browser && ready && $isAuthenticated === false) {
		goto('/');
	}
</script>

{#if $isAuthenticated}
	<AppShell>
		<slot />
	</AppShell>
{/if}
