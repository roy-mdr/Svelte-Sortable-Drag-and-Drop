<script lang="ts">
	import EditSelected from '$lib/components/EditSelected.svelte';
	import PanelElements from '$lib/components/PanelElements.svelte';
	import PanelNewGroup from '$lib/components/PanelNewGroup.svelte';
	import TrashBin from '$lib/components/TrashBin.svelte';
</script>

<div class="side-panel">
	<TrashBin />
	<PanelNewGroup />
	<PanelElements />
	<EditSelected />
</div>

<style>
	.side-panel {
		height: 100%;
		display: grid;
		grid-template-rows: auto auto 1fr auto;
	}

	.side-panel :global(> *) {
		margin-right: var(--space-half);
		margin-bottom: var(--space-half);
		margin-left: var(--space-half);
	}

	.side-panel :global(> *:first-child) {
		margin-top: var(--space-half);
	}
</style>
