# Svelte Sortable Drang & Drop Demo Project

This is a reference / demo project in SvelteKit for drag and drop / sortable-lists applications.
This project uses the native SortableJs that can be used for vanilla JavaScript applications.

![demo-svelte-sortable](https://user-images.githubusercontent.com/8226073/235379627-04909f19-0dda-4ac5-bd68-eccdcd60db85.gif)

## Disclaimer

This project uses a [forked version](https://github.com/roy-mdr/Sortable/tree/roy) of the [SortableJs](https://github.com/SortableJS/Sortable) library.

This fork mainly addresses the data binding with the DOM rendering. Thus beeing able to use it natively with SvelteJs.

Hopefuly in the near future the PRs get merged so we could all enjoy this functionality natively.

## Install

1. `git clone https://github.com/roy-mdr/Svelte-Sortable-Drag-and-Drop.git`
2. `cd Svelte-Sortable-Drag-and-Drop`
3. `npm i`
4. `npm run dev`

## Install custom fork for your project

`npm install roy-mdr/Sortable#roy` instead of `npm install sortablejs`

## Issues and acknowledges

- Highly lacking accessibility interaction
- Some Svelte related DOM-breaking situations (already addressed and worked-arround in this project)
- Bugs / caveats form the SortableJs library such as:
  - Don't set `transition: all ...;` to a Sortable Element.
  - Don't set `display: none;` to every children of a Sortable Element
