<script lang="ts">
	import HiddenSelectableInput from '$lib/testSnippets/HiddenSelectableInput.svelte'
	import { autocompleteFilter } from '$lib/testSnippets/autoCompleteFilter'
	import AddButton from '$lib/testSnippets/AddButton.svelte'

	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!

        Example of how absolute positioning is not needed

    */

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']
</script>

<div class="grid grid-cols-3 justify-items-center">
	<p>j</p>
	<p>j</p>
	<HiddenSelectableInput
		dynamicWidth
		listItems={dataStub}
		listFilter={autocompleteFilter}
		placeholderText="Enter fruit"
		on:selected={(event) => console.log('selected: ', event.detail)}
	>
		<AddButton slot="placeholderContent" />
	</HiddenSelectableInput>
	<p>j</p>
	<HiddenSelectableInput
		dynamicWidth
		listItems={dataStub}
		listFilter={autocompleteFilter}
		placeholderText="Enter fruit"
		on:selected={(event) => console.log('selected: ', event.detail)}
	>
		<AddButton slot="placeholderContent" />
	</HiddenSelectableInput>
	<p>j</p>
</div>
