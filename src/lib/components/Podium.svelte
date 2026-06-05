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
		--podium-gold: #d4a62f;
		--podium-gold-deep: #b98618;
		--podium-gold-text: #221507;
		--podium-silver: #b8bec8;
		--podium-silver-text: #17202d;
		--podium-bronze: #b26d3e;
		--podium-bronze-text: #2a1308;
		--podium-muted: #91b39e;
		--podium-placeholder: #9caabd;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		align-items: end;
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
		background: var(--podium-gold-deep);
		color: var(--podium-gold-text);
		border: 1px solid rgba(34, 21, 7, 0.38);
	}

	.placeholder {
		background: rgba(255, 255, 255, 0.05);
		color: var(--podium-placeholder);
	}

	strong,
	p {
		display: block;
		margin: 0;
	}

	p {
		color: var(--podium-muted);
		margin-top: 0.25rem;
		margin-bottom: 0.6rem;
	}

	.pillar {
		display: grid;
		place-items: center;
		border-radius: 0;
		background: var(--podium-gold-deep);
		color: var(--podium-gold-text);
		font-weight: 800;
	}

	.rank-1 .pillar {
		background: var(--podium-gold);
	}

	.rank-2 .pillar {
		background: var(--podium-silver);
	}

	.rank-3 .pillar {
		background: var(--podium-bronze);
	}

	.rank-2 .avatar {
		background: var(--podium-silver);
		color: var(--podium-silver-text);
	}

	.rank-1 .avatar {
		background: var(--podium-gold);
		color: var(--podium-gold-text);
	}

	.rank-3 .avatar {
		background: var(--podium-bronze);
		color: var(--podium-bronze-text);
	}
</style>
