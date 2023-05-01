<script lang="ts">
	import { selectedId } from '$lib/stores/appState';

	export let id: App.Element['id'];
	export let name: App.Element['name'];
	export let ctrlDown: boolean;

	function toggleSelect() {
		if ($selectedId == id) {
			selectedId.set('');
		} else {
			selectedId.set(id);
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	{id}
	class="handle draggable"
	class:handle-copy={ctrlDown}
	class:selected={$selectedId == id}
	on:click={toggleSelect}
>
	{name}
</div>

<style>
	.selected {
		background-color: var(--accent);
		border: 1px solid var(--accent);
	}
</style>
