<svelte:options runes={false} />

<script lang="ts">
	import type { Point } from '$lib/types';

	export let selectedGuess: Point | null = null;
	export let actualPoint: Point | null = null;
	export let revealActual = false;
	export let interactive = true;
	export let onGuess: ((point: Point) => void) | null = null;

	function handleClick(event: MouseEvent) {
		if (!interactive || !onGuess) {
			return;
		}

		const target = event.currentTarget as HTMLDivElement;
		const rect = target.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		onGuess({
			x: Math.max(0, Math.min(100, Math.round(x * 10) / 10)),
			y: Math.max(0, Math.min(100, Math.round(y * 10) / 10))
		});
	}
</script>

<button
	type="button"
	class:interactive
	class="map"
	disabled={!interactive}
	onclick={handleClick}
>
	<div class="sector canal">Canal</div>
	<div class="sector factory">Factory</div>
	<div class="sector skyline">Skyline</div>
	<div class="sector rail">Rail</div>
	<div class="sector mid">Mid</div>
	<div class="sector docks">Docks</div>
	<div class="sector archive">Archive</div>
	<div class="sector citadel">Citadel</div>

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

<style>
	.map {
		position: relative;
		display: block;
		width: 100%;
		min-height: 280px;
		border-radius: 1.4rem;
		overflow: hidden;
		border: 1px solid rgba(247, 178, 103, 0.28);
		background:
			linear-gradient(140deg, rgba(34, 53, 78, 0.95), rgba(17, 27, 38, 0.98)),
			linear-gradient(90deg, transparent 49%, rgba(255, 255, 255, 0.08) 50%, transparent 51%),
			linear-gradient(transparent 49%, rgba(255, 255, 255, 0.08) 50%, transparent 51%);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
	}

	.map::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
			linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px);
		background-size: 20% 20%;
		pointer-events: none;
	}

	.map:disabled {
		opacity: 1;
	}

	.interactive {
		cursor: crosshair;
	}

	.sector {
		position: absolute;
		padding: 0.35rem 0.55rem;
		border-radius: 999px;
		font-size: 0.82rem;
		color: rgba(246, 241, 232, 0.8);
		background: rgba(9, 16, 23, 0.28);
		backdrop-filter: blur(6px);
	}

	.canal {
		left: 8%;
		top: 12%;
	}

	.factory {
		left: 36%;
		top: 8%;
	}

	.skyline {
		right: 10%;
		top: 15%;
	}

	.rail {
		left: 12%;
		top: 48%;
	}

	.mid {
		left: 44%;
		top: 42%;
	}

	.docks {
		right: 8%;
		top: 54%;
	}

	.archive {
		left: 24%;
		bottom: 12%;
	}

	.citadel {
		right: 12%;
		bottom: 10%;
	}

	.marker {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 1.15rem;
		height: 1.15rem;
		border-radius: 999px;
		box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.09);
	}

	.marker span {
		position: absolute;
		top: 1.4rem;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		padding: 0.25rem 0.45rem;
		border-radius: 999px;
		font-size: 0.74rem;
		background: rgba(9, 16, 23, 0.72);
	}

	.guess {
		background: #f7b267;
	}

	.actual {
		background: #52d3a4;
	}
</style>
