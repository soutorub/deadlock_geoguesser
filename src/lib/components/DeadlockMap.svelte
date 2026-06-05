<svelte:options runes={false} />

<script lang="ts">
	import type { Point } from '$lib/types';

	export let selectedGuess: Point | null = null;
	export let actualPoint: Point | null = null;
	export let revealActual = false;
	export let interactive = true;
	export let onGuess: ((point: Point) => void) | null = null;
	export let mapImageUrl: string | null = '/deadlock_minimap.png';

	function handleClick(event: MouseEvent) {
		if (!interactive || !onGuess) {
			return;
		}

		const target = event.currentTarget as HTMLDivElement;
		const rect = target.getBoundingClientRect();
		const localX = event.clientX - rect.left;
		const localY = event.clientY - rect.top;
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const radius = Math.min(rect.width, rect.height) / 2;
		const distanceFromCenter = Math.hypot(localX - centerX, localY - centerY);

		if (distanceFromCenter > radius) {
			return;
		}

		const x = (localX / rect.width) * 100;
		const y = (localY / rect.height) * 100;

		onGuess({
			x: Math.max(0, Math.min(100, Math.round(x * 10) / 10)),
			y: Math.max(0, Math.min(100, Math.round(y * 10) / 10))
		});
	}
</script>

<div class="map-shell">
	<button
		type="button"
		class:interactive
		class="map-surface"
		style={`--map-image: ${mapImageUrl ? `url('${mapImageUrl}')` : 'none'}`}
		disabled={!interactive}
		onclick={handleClick}
	>
		{#if selectedGuess}
			<div class="marker guess" style={`left:${selectedGuess.x}%; top:${selectedGuess.y}%`}></div>
		{/if}

		{#if revealActual && actualPoint}
			<div class="marker actual" style={`left:${actualPoint.x}%; top:${actualPoint.y}%`}></div>
		{/if}
	</button>
</div>

<style>
	.map-shell {
		display: grid;
		place-items: center;
		width: 100%;
		min-height: 32rem;
	}

	.map-surface {
		position: relative;
		display: block;
		width: min(100%, 42rem);
		aspect-ratio: 1;
		min-width: 28rem;
		border-radius: 999px;
		overflow: hidden;
		border: 1px solid var(--app-color-accent-fill-strong);
		background-image:var(--map-image);
		background-position: center;
		background-repeat: no-repeat;
	}

	.map-surface:disabled {
		opacity: 1;
	}

	.interactive {
		cursor: crosshair;
	}

	.marker {
		position: absolute;
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 999px;
		border: 1px solid var(--app-color-accent-contrast-border);
	}

	.guess {
		background: #f7b267;
	}

	.actual {
		background: #52d3a4;
	}

	@media (max-width: 900px) {
		.map-shell {
			min-height: 24rem;
		}

		.map-surface {
			width: min(100%, 32rem);
			min-width: 18rem;
		}
	}
</style>
