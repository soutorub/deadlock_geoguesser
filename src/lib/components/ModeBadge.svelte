<svelte:options runes={false} />

<script lang="ts">
	import type { GameMode } from '$lib/types';

	export let mode: GameMode;
</script>

<span class="badge text-bg-success">{mode.roundCount} Bilder · {mode.timerSeconds === 60 ? '1 min' : `${mode.timerSeconds} sek`}</span>

<style>
	.badge {
		padding: 0.45rem 0.75rem;
		font-size: 0.88rem;
	}
</style>
