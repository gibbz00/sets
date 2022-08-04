<script lang="ts">
	import AutoComplete from '$lib/testSnippets/AutoComplete.svelte'

	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!
    */

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']
</script>

<AutoComplete data={dataStub} placeholderText="Enter fruit" />
