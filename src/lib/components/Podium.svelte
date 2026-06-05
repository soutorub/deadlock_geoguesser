<svelte:options runes={false} />

<script lang="ts">
	import type { ScoreEntry } from '$lib/types';

	export let scores: ScoreEntry[] = [];

	const podiumOrder = [1, 0, 2];

	function heightFor(rank: number) {
		if (rank === 1) return '11rem';
		if (rank === 2) return '8.5rem';
		if (rank === 3) return '6.5rem';
		return '6rem';
	}
</script>

<div class="podium">
	{#each podiumOrder as sourceIndex}
		{@const score = scores[sourceIndex]}
		{@const rank = sourceIndex + 1}
		<div class={`slot rank-${rank}`}>
			{#if score}
				<div class="avatar">{score.avatar}</div>
				<strong>{score.username}</strong>
				<p>{score.totalScore} Punkte</p>
				<div class="pillar" style={`height:${heightFor(rank)}`}>
					<span>#{rank}</span>
				</div>
			{:else}
				<div class="placeholder">
					<span>frei</span>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.podium {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		align-items: end;
	}

	.slot {
		text-align: center;
	}

	.avatar,
	.placeholder {
		width: 3.2rem;
		height: 3.2rem;
		margin: 0 auto 0.75rem;
		border-radius: 0;
		display: grid;
		place-items: center;
		font-weight: 700;
	}

	.avatar {
		background: #d2a93f;
		color: #221507;
		border: 1px solid rgba(34, 21, 7, 0.38);
	}

	.placeholder {
		background: rgba(255, 255, 255, 0.05);
		color: #9caabd;
	}

	strong,
	p {
		display: block;
		margin: 0;
	}

	p {
		color: #91b39e;
		margin-top: 0.25rem;
		margin-bottom: 0.6rem;
	}

	.pillar {
		display: grid;
		place-items: center;
		border-radius: 0;
		background: #b98618;
		color: #221507;
		font-weight: 800;
	}

	.rank-1 .pillar {
		background: #d4a62f;
	}

	.rank-2 .pillar {
		background: #b8bec8;
	}

	.rank-3 .pillar {
		background: #b26d3e;
	}

	.rank-2 .avatar {
		background: #b8bec8;
		color: #17202d;
	}

	.rank-1 .avatar {
		background: #d4a62f;
		color: #221507;
	}

	.rank-3 .avatar {
		background: #b26d3e;
		color: #2a1308;
	}

	@media (max-width: 720px) {
		.podium {
			grid-template-columns: 1fr;
			align-items: stretch;
		}

		.pillar {
			border-radius: 0;
		}
	}
</style>
