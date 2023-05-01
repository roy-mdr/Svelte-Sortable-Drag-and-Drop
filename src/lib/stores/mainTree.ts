import { get, writable } from 'svelte/store';

export const mtIds = writable(['g.0']);



const defaultMainGroup: App.Group = {
	id: 'g.0',
	type: 'group',
	route: '0',
	name: 'Main',
	open: true,
	children: []
}

const mainTreeStore = writable(defaultMainGroup);

function initMainTree() {

	const { subscribe, set, update } = mainTreeStore

	return {
		subscribe,

		newMainTree: (name: string) => {
			set({
				id: newMtId('group'),
				type: 'group',
				route: '0',
				name: name,
				open: true,
				children: []
			})
			update(mt => {
				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		loadMainTree: (mainTree: App.Group) => {
			/* EVALUATE CLIENT INPUT */
			/* ===================== */
			set(mainTree);
			update(mt => {
				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		addGroup: (map: App.Group['route'], targetIndex: number | undefined = undefined, newGroup: App.NewGroup) => {

			if (!map) return;

			update(mt => {
				let setItem: App.Group = {
					id: newMtId('group'),
					type: 'group',
					name: newGroup.name,
					route: '',
					open: true,
					children: []
				}

				let toList: App.Group['children'];
				try {
					toList = getGroupList(map);
				} catch (error: any) {
					console.error(error.message);
					return mt;
				}

				if (targetIndex !== undefined) {
					if (toList.length < targetIndex) {
						console.info('Target list smaller than target index. Appending to end.')
					}
					toList.splice(targetIndex, 0, setItem);
				} else {
					toList.push(setItem);
				}

				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		addElement: (map: App.Group['route'], targetIndex: number | undefined = undefined, newEl: App.NewElement) => {

			if (!map) return;

			update(mt => {
				let setItem: App.Element = {
					id: newMtId('element'),
					type: 'element',
					route: '',
					name: newEl.name
				}

				let toList: App.Group['children'];
				try {
					toList = getGroupList(map);
				} catch (error: any) {
					console.error(error.message);
					return mt;
				}

				if (targetIndex !== undefined) {
					if (toList.length < targetIndex) {
						console.info('Target list smaller than target index. Appending to end.')
					}
					toList.splice(targetIndex, 0, setItem);
				} else {
					toList.push(setItem);
				}

				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		deleteItem: (map: App.Group['route'], targetIndex: number) => {

			if (!map) return;

			update(mt => {

				let fromList: App.Group['children'];
				try {
					fromList = getGroupList(map);
				} catch (error: any) {
					console.error(error.message);
					return mt;
				}

				const movingItem = fromList[targetIndex];

				if (!movingItem) {
					console.error('Origin item not found');
					return mt;
				}

				// Remove item from 'from' list
				fromList.splice(targetIndex, 1);

				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		moveItem: (map: App.MoveSingleMap) => {

			if (!map) return;

			update(mt => {

				let fromList: App.Group['children'];
				let toList: App.Group['children'];

				try {
					fromList = getGroupList(map.from_list);
					toList = getGroupList(map.to_list);
				} catch (error: any) {
					console.error(error.message)
					return mt;
				}

				const movingItem = structuredClone(fromList[map.from_index]);

				if (!movingItem) {
					console.error('Origin item not found');
					return mt;
				}

				if (toList.length < map.to_index) {
					console.info('Target list smaller than target index. Appending to end.');
				}

				// Prevet duplicated id's in destiny list
				if ((fromList !== toList) && duplicatedId(toList, movingItem.id)) {
					console.error('Item id already in list? Creating a new one!');
					if (movingItem.type == 'element') movingItem.id = newMtId('element');
					if (movingItem.type == 'group') movingItem.id = newMtId('group');
				}

				// Remove item from 'from' list
				fromList.splice(map.from_index, 1);

				// Copy item to 'to' list
				toList.splice(map.to_index, 0, movingItem);

				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		copyItem: (map: App.MoveSingleMap) => {

			if (!map) return;

			update(mt => {

				let fromList: App.Group['children'];
				let toList: App.Group['children'];

				try {
					fromList = getGroupList(map.from_list);
					toList = getGroupList(map.to_list);
				} catch (error: any) {
					console.error(error.message);
					return mt;
				}

				const copyItem = structuredClone(fromList[map.from_index]);

				if (!copyItem) {
					console.error('Origin item not found');
					return mt;
				}

				if (toList.length < map.to_index) {
					console.info('Target list smaller than target index. Appending to end.');
				}

				if (copyItem.type == 'element') copyItem.id = newMtId('element');
				if (copyItem.type == 'group') deepRecurse(copyItem, { remakeRoutes: false, remakeIds: true });

				// Prevet duplicated id's in list
				if (duplicatedId(toList, copyItem.id)) {
					alert('Item already in list... That\'s weird... Contact support or something 🤣');
					return mt;
				}

				// Place item to 'to' list
				toList.splice(map.to_index, 0, copyItem);

				if (fromList === toList) {
					mt.id = newMtId('group');
				}

				updateRoutesAndSyncIds(mt);
				return mt;
			})
		},

		rebuild: () => update(mt => {
			updateRoutesAndSyncIds(mt);
			return mt;
		}),

		toggleOpenGroup: (map: App.Group['route']) => {

			if (!map) return;

			update(mt => {
				const group = getGroup(map);
				if (group.open === undefined) {
					group.open = false;
					return mt;
				}
				group.open = !group.open;
				return mt;
			});
		}
	}
}

export const mainTree = initMainTree();



/* HELPERS */

function updateRoutesAndSyncIds(mainTree: App.Group) {
	mtIds.set([]);
	deepRecurse(mainTree);
}

function newMtId(itemType: App.Group['type'] | App.Element['type']): string {

	let tmpId: string = '';

	if (itemType == 'group') tmpId = makeId('g.', 5);
	if (itemType == 'element') tmpId = makeId('e.', 5);

	if (tmpId == '') throw new Error(`Invalid type '${itemType}'`);

	if (get(mtIds).includes(tmpId)) {
		return newMtId(itemType);
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

function getGroup(groupRoute: App.Group['route']) {
	const route: string[] = groupRoute.split('/');

	let currentGroup = get(mainTreeStore);
	let currentGroupList = currentGroup.children;

	route.shift(); // Ignore first item (home route)

	for (let ix = 0; ix < route.length; ix++) {
		// @ts-ignore --- to fix
		currentGroup = currentGroupList[parseInt(route[ix])];
		currentGroupList = currentGroup?.children || undefined;
	}

	if (!currentGroupList) throw new Error(`Children of '${groupRoute}' not found`);

	return currentGroup;
}

function getGroupList(groupRoute: App.Group['route']) {
	const route: string[] = groupRoute.split('/');

	let currentGroup = get(mainTreeStore).children;

	route.shift(); // Ignore first item (home route)

	for (let ix = 0; ix < route.length; ix++) {
		// @ts-ignore --- to fix
		currentGroup = currentGroup[parseInt(route[ix])]?.children || undefined;
	}

	if (!currentGroup) throw new Error(`Children of '${groupRoute}' not found`);

	return currentGroup;
}

interface deepRecurseOptionsNoRoutes {
	remakeRoutes: false;
	remakeIds: boolean;
}

interface deepRecurseOptionsRoutes {
	remakeRoutes: true;
	initRoute: App.Group['route'];
	remakeIds: boolean;
}

const deepRecurseDefaultOptions: deepRecurseOptionsRoutes = {
	remakeRoutes: true,
	initRoute: '0',
	remakeIds: false
}

function deepRecurse(root: App.Group | App.Element, options: deepRecurseOptionsNoRoutes | deepRecurseOptionsRoutes = deepRecurseDefaultOptions) {

	if (root.type == 'group') {
		if (options.remakeIds) {
			root.id = newMtId('group');
		}

		// Push id to store
		mtIds.update(ids => { ids.push(root.id); return ids; });

		if (options.remakeRoutes) {

			root.route = options.initRoute;

			// Recurse and pass new route to child
			for (let ix = 0; ix < root.children.length; ix++) {
				const newOptions = structuredClone(options);
				newOptions.initRoute = `${options.initRoute}/${ix}`;
				deepRecurse(<App.Group>root.children[ix], newOptions);
			}
		} else {
			// Recurse as is
			for (let ix = 0; ix < root.children.length; ix++) {
				deepRecurse(<App.Group>root.children[ix], options);
			}
		}
	}

	if (root.type == 'element') {
		if (options.remakeRoutes) {
			root.route = options.initRoute;
		}

		if (options.remakeIds) {
			root.id = newMtId('element');
		}

		// Push id to store
		mtIds.update(ids => { ids.push(root.id); return ids; });
	}
}

function duplicatedId(list: App.Group['children'], id: string) {
	for (let i = 0; i < list.length; i++) {
		if (list[i].id == id) return true;
	}
	return false;
}
