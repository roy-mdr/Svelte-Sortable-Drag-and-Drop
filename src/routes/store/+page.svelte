<script lang="ts">
	import { mainTree, mtIds } from '$lib/stores/mainTree';

	function newMainTree() {
		mainTree.newMainTree('New Main Tree!');
	}

	function loadMainTree_1() {
		mainTree.loadMainTree({
			id: 'g.HCFEO',
			type: 'group',
			open: true,
			route: '',
			name: 'Loaded a Main Tree',
			children: [
				{
					id: 'g.r943a',
					type: 'group',
					open: false,
					name: 'Group 1',
					route: '',
					children: [
						{
							id: 'g.r943b',
							type: 'group',
							open: true,
							name: 'Group 2',
							route: '',
							children: [
								{
									id: 'e._0Bla',
									type: 'element',
									name: 'Element 1',
									route: ''
								}
							]
						}
					]
				},
				{
					id: 'g.r943E',
					type: 'group',
					open: true,
					name: 'Group 3',
					route: '',
					children: []
				},
				{
					id: 'e._0Bln',
					type: 'element',
					name: 'Element 2',
					route: ''
				},
				{
					id: 'g.S9V74',
					type: 'group',
					open: true,
					name: 'Group 4',
					route: '',
					children: []
				},
				{
					id: 'e.PCzLA',
					type: 'element',
					name: 'Element 3',
					route: ''
				}
			]
		});
	}

	function loadMainTree_2() {
		mainTree.loadMainTree({
			id: 'z-0',
			type: 'group',
			open: true,
			route: '',
			name: 'Example #2',
			children: [
				{
					id: 'a-7',
					type: 'element',
					name: 'Element A',
					route: ''
				},
				{
					id: 'z-1',
					type: 'group',
					open: true,
					route: '',
					name: 'Group A',
					children: [
						{
							id: 'a-1',
							type: 'element',
							name: '[COLLIDING ID] ELEMENT #1',
							route: ''
						},
						{
							id: 'z-2',
							type: 'group',
							open: false,
							route: '',
							name: 'Group B',
							children: [
								{
									id: 'a-2',
									type: 'element',
									name: 'Element B',
									route: ''
								},
								{
									id: 'a-6',
									type: 'element',
									name: 'Element C',
									route: ''
								},
								{
									id: 'a-1',
									type: 'element',
									name: '[COLLIDING ID] ELEMENT #2',
									route: ''
								}
							]
						}
					]
				},
				{
					id: 'a-3',
					type: 'element',
					name: 'Element C',
					route: ''
				},
				{
					id: 'a-4',
					type: 'element',
					name: 'Element D',
					route: ''
				},
				{
					id: 'a-5',
					type: 'element',
					name: 'Element E',
					route: ''
				}
			]
		});
	}

	function addGroup() {
		mainTree.addGroup('0', 1, {
			name: 'Group added'
		});
	}

	function addElement() {
		mainTree.addElement('0/0', 1, {
			name: 'Element added'
		});
	}

	function moveItem() {
		mainTree.moveItem({
			from_list: '0/0',
			from_index: 1,
			to_list: '0/0',
			to_index: 0
		});
	}

	function copyItem() {
		mainTree.copyItem({
			from_list: '0/0',
			from_index: 0,
			to_list: '0/0',
			to_index: 1
		});
	}

	function delItem() {
		mainTree.deleteItem('0/0', 1);
	}

	$: store = JSON.stringify($mainTree, undefined, 2);
</script>

<a href="/">Go to Interactive Tree</a>

<div>
	<button type="button" on:click={newMainTree}>New Main Tree</button>
	<button type="button" on:click={loadMainTree_1}>Load Tree #1</button>
	<button type="button" on:click={loadMainTree_2}>Load Tree #2</button>
	<button type="button" on:click={addGroup}>Add Group</button>
	<button type="button" on:click={addElement}>Add element</button>
	<button type="button" on:click={moveItem}>Move item</button>
	<button type="button" on:click={copyItem}>Copy item</button>
	<button type="button" on:click={delItem}>Delete item</button>
</div>

<div style="display: flex;">
	<pre>
{store}
	</pre>

	<pre>
{$mtIds}
	</pre>
</div>
