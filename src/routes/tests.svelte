<script lang="ts">
	import HiddenInput from '$lib/testSnippets/HiddenInput.svelte'

	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!
    */

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']
</script>

<!-- <AutoComplete data={dataStub} placeHolderText="Enter fruit" /> -->
<!-- <AutoComplete data={dataStub} /> -->
<HiddenInput
	on:selected={() => {
		console.log('fired selected event')
	}}
/>
