<script lang="ts">
	import Controller from '$lib/Controller.svelte'

	let controller: Controller
</script>

<Controller bind:this={controller} />

<slot name="title" />
