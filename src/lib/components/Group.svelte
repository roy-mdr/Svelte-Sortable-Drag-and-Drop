<script lang="ts">
	import { slide } from 'svelte/transition';
	import GroupSortable from '$lib/components/GroupSortable.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, selectedId } from '$lib/stores/appState';
	import { speedMs } from '$lib/stores/appConstants';

	export let id: App.Group['id'];
	export let name: App.Group['name'];
	export let children: App.Group['children'];
	export let isMainTree = false;
	export let route: App.Group['route'];
	export let isOpen: App.Group['open'] = true;

	function toggleOpen() {
		mainTree.toggleOpenGroup(route);
	}

	function toggleSelect() {
		if ($selectedId == id) {
			selectedId.set('');
		} else {
			selectedId.set(id);
		}
	}
</script>

<div {id} class="panel group" class:radius={isMainTree} class:selected={$selectedId == id}>
	<div class="header">
		{#if !isMainTree}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="arrow" class:open={isOpen} on:click={toggleOpen}>►</div>
		{/if}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="title"
			class:handle={!isMainTree}
			class:handle-copy={!isMainTree && $ctrlKeyIsDown}
			on:click={toggleSelect}
		>
			{name}
		</div>
	</div>
	<!-- Set transition in this div -->
	{#if isOpen}
		<div transition:slide|local={{ duration: speedMs }}>
			<GroupSortable {route} content={children} />
		</div>
	{/if}
</div>

<style>
	.arrow {
		margin-right: var(--space-half);
		cursor: pointer;
		transition: transform var(--speed-normal);
	}

	.arrow.open {
		transform: rotate(90deg);
	}

	.selected {
		background-color: var(--accent);
		border: 1px solid var(--accent);
	}
</style>
