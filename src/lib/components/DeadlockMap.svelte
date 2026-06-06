<svelte:options runes={false} />

<script lang="ts">
	import type { Point } from '$lib/types';

	export let selectedGuess: Point | null = null;
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
			class="map-playfield"
			disabled={!interactive}
			onclick={handleClick}
	>
		{#if mapImageUrl}
			<img class="map-image" src={mapImageUrl} alt="Deadlock minimap" draggable="false" />
		{/if}
		{#if selectedGuess}
			<div class="marker guess" style={`left:${selectedGuess.x}%; top:${selectedGuess.y}%`}></div>
		{/if}
	</button>
</div>

<style>
	.interactive {
		cursor: crosshair;
	}
	.map-shell {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.map-playfield {
		position: relative;
		display: block;
		width: 75%;
		padding: 0;
		border: none;
		background: none;
		line-height: 0;
	}

	.map-image {
		display: block;
		width: 100%;
		height: auto;
		pointer-events: none;
		border-radius: 999px;
		border: 1px solid var(--app-color-accent-fill-strong);
	}

	.marker {
		position: absolute;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 999px;
		border: 1px solid var(--app-color-accent-contrast-border);
		transform: translate(-50%, -50%);
	}

	.guess {
		background: #f7b267;
	}
</style>
