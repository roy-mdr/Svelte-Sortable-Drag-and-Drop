<script lang="ts">
	import Group from '$lib/components/Group.svelte';
	import SidePanel from '$lib/components/SidePanel.svelte';

	import { mainTree } from '$lib/stores/mainTree';
	import { ctrlKeyIsDown, selectedId } from '$lib/stores/appState';

	let mtGroup: HTMLElement;

	function handleKeydown(ev: KeyboardEvent) {
		ctrlKeyIsDown.set(ev.ctrlKey);

		if (ev.key === 'Escape') {
			selectedId.set('');
		}
	}

	function handleMtGroupClick(ev: Event) {
		if (ev.target === mtGroup) {
			selectedId.set('');
		}
	}

	$: store = JSON.stringify($mainTree, undefined, 2);
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeydown} />

<div class="layout">
	<!-- <a href="/store">Check Store State</a> -->
	<SidePanel />

	<pre class="watermark noselect">
{store}
	</pre>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="mt-group" bind:this={mtGroup} on:click={handleMtGroupClick}>
		{#key $mainTree.id}
			<Group
				id={$mainTree.id}
				name={$mainTree.name}
				children={$mainTree.children}
				route={$mainTree.route}
				isMainTree={true}
				isOpen={$mainTree.open}
			/>
		{/key}
	</div>
</div>

<style>
	.layout {
		display: flex;
		height: 100%;
	}

	.mt-group {
		overflow: auto;
		width: 100%;
		padding: 10em;
	}

	.watermark {
		z-index: -1;
		font-size: small;
		color: var(--mid);
		position: absolute;
		top: 2em;
		left: 20em;
		max-height: calc(100% - 4em);
		overflow: hidden;
	}
</style>
