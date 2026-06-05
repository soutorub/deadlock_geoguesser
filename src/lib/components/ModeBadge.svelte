<svelte:options runes={false} />

<script lang="ts">
	import type { GameMode } from '$lib/types';

	export let mode: GameMode;
</script>

<span class="badge mode-badge">{mode.roundCount} Bilder · {mode.timerSeconds === 60 ? '1 min' : `${mode.timerSeconds} sek`}</span>

<style>
	.mode-badge {
		padding: 0.5rem 0.7rem;
		font-size: 1rem;
		background: rgba(199, 211, 111, 0.12);
		color: #e9efc4;
		border: 1px solid rgba(199, 211, 111, 0.34);
		font-weight: 700;
	}
</style>
