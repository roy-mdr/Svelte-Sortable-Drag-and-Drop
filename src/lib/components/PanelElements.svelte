<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Sortable from 'sortablejs';
	import AddElement from '$lib/components/AddElement.svelte';

	import { dragNewElement } from '$lib/stores/appState';
	import { elementLib } from '$lib/stores/elementsLib';
	import { speedMs } from '$lib/stores/appConstants';

	onMount(() => {
		setupSortable();
	});

	let sortEl: HTMLElement;

	function setupSortable() {
		Sortable.create(sortEl, {
			group: {
				name: 'panel-els',
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
			delayOnTouchOnly: true,

			onStart: (e) => {
				dragNewElement.setElData($elementLib[<number>e.oldIndex]);
			},

			onEnd: (e) => {
				dragNewElement.clear();
			}
		});
	}
</script>

<div class="panel radius flex-column" style="flex-grow: 1;">
	<div class="header">
		<div class="title">Elements</div>
	</div>
	<AddElement />
	<div class="container custom-overflow" class:empty={$elementLib.length < 1} bind:this={sortEl}>
		{#each $elementLib as elmt (elmt.id)}
			<div class="handle draggable" transition:slide|local={{ duration: speedMs }}>{elmt.name}</div>
		{/each}
	</div>
</div>

<style>
	.flex-column {
		display: flex;
		flex-direction: column;
		/* flex-grow: 1; */
		min-height: 0px;
	}

	.custom-overflow {
		overflow-y: auto;
		overflow-x: hidden;
		/* height: 100%; */
		flex-grow: 1;
	}
</style>
