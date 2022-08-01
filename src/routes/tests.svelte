<script lang="ts">
	import Hidden from '$lib/testSnippets/Hidden.svelte'

	import HiddenInput from '$lib/testSnippets/HiddenInput.svelte'
	import SelectableInput from '$lib/testSnippets/SelectableInput.svelte'

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
	on:canceled={() => {
		console.log('fired canceled event')
	}}
/>
