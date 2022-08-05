<script lang="ts">
	import HiddenAutoComplete from '$lib/testSnippets/HiddenAutoComplete.svelte'

	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!
    */

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']
</script>

<HiddenAutoComplete data={dataStub} placeholderText="Enter fruit" />
