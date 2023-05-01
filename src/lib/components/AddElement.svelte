<script lang="ts">
	import { elementLib } from '$lib/stores/elementsLib';

	let inputName: HTMLElement;

	let newEl: App.NewElementClass = {
		name: ''
	};

	function addElAndReset() {
		elementLib.addElement(newEl);
		newEl = {
			name: ''
		};
		inputName.focus();
	}
</script>

<form on:submit|preventDefault={addElAndReset}>
	<input type="text" bind:value={newEl.name} bind:this={inputName} />
	<button type="submit">Add</button>
</form>
