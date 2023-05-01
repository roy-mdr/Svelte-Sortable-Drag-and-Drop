<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Sortable from 'sortablejs';
	import Group from '$lib/components/Group.svelte';
	import Element from '$lib/components/Element.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, dragNewElement, draggingType, draggingData } from '$lib/stores/appState';
	import { speedMs } from '$lib/stores/appConstants';

	onMount(() => {
		setupSortable(groupSortEl);
	});

	onDestroy(() => {
		if (groupSortable) {
			groupSortable.destroy();
			groupSortable = undefined;
		}
	});

	export let content: App.Group['children'];
	export let route: App.Group['route'];

	let groupSortEl: HTMLElement;
	let groupSortable: Sortable | undefined;

	$: toggleSortableClone($ctrlKeyIsDown);

	function toggleSortableClone(ctrlKeyDown: boolean) {
		if (!groupSortable) return;

		if (ctrlKeyDown) {
			groupSortable?.option('group', {
				name: 'group',
				put: ['group', 'panel-els', 'panel-group'],
				pull: 'clone'
			});
		} else {
			groupSortable?.option('group', {
				name: 'group',
				put: ['group', 'panel-els', 'panel-group']
			});
		}
	}

	function setupSortable(sortableEl: HTMLElement) {
		if (!sortableEl) return;

		groupSortable = Sortable.create(sortableEl, {
			group: {
				name: 'group',
				put: ['group', 'panel-els', 'panel-group']
			},
			// @ts-ignore --- because using my own fork
			revertDOM: true,
			animation: speedMs,
			handle: '.handle',
			fallbackOnBody: true,
			invertSwap: true,
			delay: 200,
			delayOnTouchOnly: true,

			onAdd: (e) => {
				// drag from one list and drop into another

				// If origin list is "group"
				// @ts-ignore --- because using my own fork
				if (e.fromSortable.options.group.name == 'group') {
					// console.log('moving:', e.item);

					const moveMap = {
						from_list: e.from.getAttribute('map') || '0',
						from_index: e.oldIndex || 0,
						to_list: e.to.getAttribute('map') || '0',
						to_index: e.newIndex || 0
					};

					if ($ctrlKeyIsDown) {
						mainTree.copyItem(moveMap);
					} else {
						mainTree.moveItem(moveMap);
					}
				}

				// If origin list is "panel-els"
				// @ts-ignore --- because using my own fork
				if (e.fromSortable.options.group.name == 'panel-els') {
					// console.log('adding:', e.item);

					if (!$dragNewElement) return;

					const newElData = <App.ElementClass>$dragNewElement;
					const to_list = e.to.getAttribute('map') || '0';
					const to_index = e.newIndex || 0;

					mainTree.addElement(to_list, to_index, { name: newElData.name });
				}

				// If origin list is "panel-group"
				// @ts-ignore --- because using my own fork
				if (e.fromSortable.options.group.name == 'panel-group') {
					const to_list = e.to.getAttribute('map') || '0';
					const to_index = e.newIndex || 0;

					mainTree.addGroup(to_list, to_index, { name: 'New Group' });
				}
			},

			onSort: (e) => {
				// drag & drop within the same list

				if ($ctrlKeyIsDown) {
					const moveMap = {
						from_list: e.from.getAttribute('map') || '0',
						from_index: e.oldIndex || 0,
						to_list: e.to.getAttribute('map') || '0',
						to_index: e.newIndex || 0
					};

					// only for copy in same list
					if (moveMap.to_index > moveMap.from_index) {
						moveMap.to_index++;
					}

					mainTree.copyItem(moveMap);
				} else {
					/*
					{
						mainTree.moveItem(moveMap);
					}
					return;
					*/

					// @ts-ignore --- because using my own fork
					const movingItem = content[e.oldIndex];

					// Remove item from 'from' list
					// @ts-ignore --- because using my own fork
					content.splice(e.oldIndex, 1);

					// Copy item to 'to' list
					// @ts-ignore --- because using my own fork
					content.splice(e.newIndex, 0, movingItem);

					// Update all the tree to keep data in sync with DOM
					mainTree.rebuild();
				}
			},

			onStart: (e) => {
				draggingType.update((t) => 'group-item');
				draggingData.update((d) => `${e.from.getAttribute('map')}|${e.oldIndex}`);
			},

			onEnd: (e) => {
				draggingType.update((t) => '');
				draggingData.update((d) => '');
			}
		});
	}
</script>

<div class="container" class:empty={content.length < 1} bind:this={groupSortEl} map={route}>
	{#each content as child (child.id)}
		{#if child.type == 'group'}
			<Group
				id={child.id}
				name={child.name}
				children={child.children}
				route={child.route}
				isOpen={child.open}
			/>
		{:else if child.type == 'element'}
			<Element id={child.id} name={child.name} ctrlDown={$ctrlKeyIsDown} />
		{/if}
	{/each}
</div>
