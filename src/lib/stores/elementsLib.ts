import { get, writable } from 'svelte/store';

export const elIds = writable(<App.ElementClass['id'][]>[]);



const elsLibStore = writable(<App.ElementClass[]>[]);

function initElmtsLib() {

	const { subscribe, set, update } = elsLibStore

	return {
		subscribe,

		addElement: (newEl: App.NewElementClass) => {

			if (!newEl?.name) return;

			update(elmtL => {
				let setItem: App.ElementClass = {
					id: newElId(),
					name: newEl.name
				}

				elmtL.unshift(setItem);

				return elmtL;
			})
		}
	}
}

export const elementLib = initElmtsLib();



/* HELPERS */

function newElId(): string {

	let tmpId: string = '';

	tmpId = makeId('ac.', 5);

	if (get(elIds).includes(tmpId)) {
		return newElId();
	} else {
		return tmpId;
	}
}

function makeId(prefix = '', length = 5): string {
	let result = prefix;
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
