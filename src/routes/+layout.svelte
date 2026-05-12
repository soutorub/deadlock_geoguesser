<script lang="ts">
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { appStore } from '$lib/stores/app-store';

	let { children } = $props();

	onMount(() => {
		appStore.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Deadlock GeoGuesser Prototype</title>
</svelte:head>

{@render children()}
