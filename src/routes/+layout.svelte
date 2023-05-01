<script lang="ts">
	import './styles.css';
</script>

<div class="app">
	<main>
		<slot />
	</main>
</div>

<style>
	.app,
	main {
		height: 100%;
	}
</style>
