<script lang="ts">
	import HiddenInput from '$lib/testSnippets/HiddenInput.svelte'

	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!
    */

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']
</script>

<HiddenInput
	on:selected={() => {
		console.log('fired selected event')
	}}
/>

<!-- <AutoComplete data={dataStub} placeHolderText="Enter fruit" /> -->
<!-- <AutoComplete data={dataStub} /> -->

<!-- TODO: can slot names be autocompletes/typed? -->
<!-- <Hidden>
	<button slot="revealButton">..with explicit reveal button</button>
	<input type="text" slot="hiddenContent" />
</Hidden> -->
