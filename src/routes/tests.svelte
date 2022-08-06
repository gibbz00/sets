<script lang="ts">
	import HiddenSelectableInput from '$lib/testSnippets/HiddenSelectableInput.svelte'
	import { autocompleteFilter } from '$lib/testSnippets/autoCompleteFilter'
	import AddButton from '$lib/testSnippets/AddButton.svelte'

	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!
    */

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']
</script>

<HiddenSelectableInput
	dynamicWidth
	listItems={dataStub}
	listFilter={autocompleteFilter}
	placeholderText="Enter fruit"
	on:selected={(event) => console.log('selected: ', event.detail)}
>
	<AddButton slot="placeholderContent" />
</HiddenSelectableInput>
