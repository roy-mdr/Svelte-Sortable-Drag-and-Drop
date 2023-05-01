<script lang="ts">
	import { slide } from 'svelte/transition';

	import { mainTree } from '$lib/stores/mainTree';
	import { selectedId } from '$lib/stores/appState';
	import { speedMs } from '$lib/stores/appConstants';

	let parentRoute: App.Group['route'] | undefined;
	let thisIndex: number | undefined;
	let inputName: HTMLElement;
	let itemData: App.Group | App.Element | undefined;
	let itemClone: App.Group | App.Element | undefined;

	function getSelected(rootItem: App.Group | App.Element, id: App.Group['id'] | App.Element['id']) {
		parentRoute = undefined;
		thisIndex = undefined;
		itemData = selectById(rootItem, id);
		itemClone = structuredClone(itemData);
	}

	function selectById(
		rootItem: App.Group | App.Element,
		id: App.Group['id'] | App.Element['id']
	): App.Group | App.Element | undefined {
		if (rootItem.id == id) {
			let thisRoute = rootItem.route.split('/') || '';
			thisIndex = parseInt(<string>thisRoute?.pop()) || 0;
			parentRoute = thisRoute.join('/');

			return rootItem;
		} else {
			if (rootItem.type == 'group') {
				// Use a for loop instead of forEach to avoid nested functions
				// Otherwise "return" will not work properly
				for (let i = 0; i < rootItem.children.length; i++) {
					// Search in the current child
					let innerSearch = selectById(rootItem.children[i], id);

					if (innerSearch) {
						let thisRoute = innerSearch.route.split('/') || '';
						thisIndex = parseInt(<string>thisRoute?.pop()) || 0;
						parentRoute = thisRoute.join('/');

						return innerSearch;
					}
				}
			}

			// The node has not been found and we have no more options
			return;
		}
	}

	function focusInput(trigger: any) {
		inputName?.focus();
	}

	$: getSelected($mainTree, $selectedId);
	$: focusInput($selectedId);

	function duplicateItem() {
		mainTree.copyItem({
			from_list: parentRoute || '',
			from_index: thisIndex || 0,
			to_list: parentRoute || '',
			to_index: (thisIndex || 0) + 1
		});
	}

	function submitChanges() {
		for (const key in itemData) {
			// @ts-ignore --- don't quite know how to type this correctly
			itemData[key] = itemClone[key];
		}
		mainTree.rebuild();
		selectedId.set('');
	}
</script>

{#if itemClone}
	<div class="panel radius" transition:slide|local={{ duration: speedMs }} on:introend={focusInput}>
		<div class="header">
			<div class="title">Edit: {itemClone.id}</div>
		</div>
		<form on:submit|preventDefault={submitChanges}>
			<label>
				Name:
				<input type="text" bind:value={itemClone.name} bind:this={inputName} />
			</label>
			<div>
				<button type="submit">Save</button>
				<button type="button" on:click={duplicateItem}>Duplicate</button>
				<button type="button" on:click={() => selectedId.set('')}>Cancel</button>
				{#if parentRoute}
					<button
						type="button"
						on:click={() => mainTree.deleteItem(parentRoute || '', thisIndex || 0)}>Delete</button
					>
				{/if}
			</div>
		</form>
	</div>
{/if}
