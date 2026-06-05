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
			<div class="marker guess" style={`left:${selectedGuess.x}%; top:${selectedGuess.y}%`}>
				<span>Du</span>
			</div>
		{/if}

		{#if revealActual && actualPoint}
			<div class="marker actual" style={`left:${actualPoint.x}%; top:${actualPoint.y}%`}>
				<span>Ziel</span>
			</div>
		{/if}
	</button>
</div>

<style>
	.map-shell {
		display: grid;
		place-items: center;
		width: 100%;
		min-height: 22rem;
	}

	.map-surface {
		position: relative;
		display: block;
		width: 70%;
		max-width: 32rem;
		aspect-ratio: 1;
		min-width: 18rem;
		border-radius: 999px;
		overflow: hidden;
		border: 1px solid rgba(199, 211, 111, 0.18);
		background-image:
			linear-gradient(rgba(7, 9, 8, 0.12), rgba(7, 9, 8, 0.12)),
			var(--map-image),
			linear-gradient(90deg, transparent 49.4%, rgba(255, 255, 255, 0.12) 50%, transparent 50.6%),
			linear-gradient(transparent 49.4%, rgba(255, 255, 255, 0.12) 50%, transparent 50.6%),
			linear-gradient(90deg, transparent 49.7%, rgba(255, 255, 255, 0.24) 50%, transparent 50.3%),
			linear-gradient(transparent 49.7%, rgba(255, 255, 255, 0.24) 50%, transparent 50.3%),
			linear-gradient(160deg, rgba(28, 36, 33, 0.98), rgba(18, 23, 20, 0.98));
		background-position: center, center, center, center, center, center, center;
		background-size: 100% 100%, contain, 5% 5%, 5% 5%, 10% 10%, 10% 10%, cover;
		background-repeat: no-repeat;
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
	}

	.map-surface::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
			linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
		background-size: 5% 5%;
		pointer-events: none;
	}

	.map-surface:disabled {
		opacity: 1;
	}

	.interactive {
		cursor: crosshair;
	}

	.marker {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 999px;
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.11);
		border: 1px solid rgba(11, 14, 12, 0.6);
	}

	.marker span {
		position: absolute;
		top: 1.2rem;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		padding: 0.25rem 0.45rem;
		border-radius: 0;
		font-size: 0.74rem;
		background: rgba(9, 16, 23, 0.72);
	}

	.guess {
		background: #f7b267;
	}

	.actual {
		background: #52d3a4;
	}

	@media (max-width: 900px) {
		.map-surface {
			width: 82%;
		}
	}
</style>
