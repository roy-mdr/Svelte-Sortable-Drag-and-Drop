// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}

		interface ElementClass {
			id: string;
			name: string;
		}

		interface NewElementClass {
			name: string;
		}

		interface Group {
			id: string;
			type: 'group';
			name: string;
			route: string;
			open: boolean;
			children: (Group | Element)[];
		}

		interface NewGroup {
			name: string;
		}

		interface Element {
			id: string;
			type: 'element';
			route: string;
			name: string;
		}

		interface NewElement {
			name: string;
		}

		interface MoveSingleMap {
			from_list: Group['route'];
			from_index: number;
			to_list: Group['route'];
			to_index: number;
		}
	}

	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'map'?: string;
		}
	}
}

export { };
