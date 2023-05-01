import { writable } from 'svelte/store';

export const selectedId = writable(<App.Group['id'] | App.Element['id']>"");
export const ctrlKeyIsDown = writable(false);
export const draggingType = writable("");
export const draggingData = writable("");



function initDragNewEl() {

	const { subscribe, set, update } = writable();

	return {
		subscribe,

		setElData: (elData: App.ElementClass) => set(elData),

		clear: () => set(undefined)
	}
}

export const dragNewElement = initDragNewEl();
