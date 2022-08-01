<script lang="ts">
	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!
    */

	import AutoComplete from '$lib/testSnippets/AutoComplete.svelte'
	import Hidden from '$lib/testSnippets/Hidden.svelte'
	import InputClickSelectable from '$lib/testSnippets/InputClickSelectable.svelte'

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']
</script>

<InputClickSelectable
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
