<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';

	import { speedMs } from '$lib/stores/appConstants';

	onMount(() => {
		setupSortable();
	});

	let sortEl: HTMLElement;

	function setupSortable() {
		Sortable.create(sortEl, {
			group: {
				name: 'panel-group',
				pull: 'clone'
			},
			sort: false,
			// @ts-ignore --- because using my own fork
			revertDOM: true,
			animation: speedMs,
			handle: '.handle',
			fallbackOnBody: true,
			invertSwap: true,
			delay: 200,
			delayOnTouchOnly: true
		});
	}
</script>

<div class="panel radius">
	<div class="container" bind:this={sortEl}>
		<div class="handle draggable">DnD New Group</div>
	</div>
</div>
