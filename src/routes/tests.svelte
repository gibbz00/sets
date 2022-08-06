<script lang="ts">
	import SelectableInput from '$lib/testSnippets/SelectableInput.svelte'
	import Hidden from '$lib/testSnippets/Hidden.svelte'
	import HiddenSelectableInput from '$lib/testSnippets/HiddenSelectableInput.svelte'
	import { autocompleteFilter } from '$lib/testSnippets/autoCompleteFilter'

	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!
    */

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']
</script>

<Hidden>
	<button slot="placeholderContent">Hidden</button>
	<div slot="hiddenContent">
		<SelectableInput on:selected={() => console.log('yike')} />
	</div>
</Hidden>

<HiddenSelectableInput
	listItems={dataStub}
	listFilter={autocompleteFilter}
	placeholderText="Enterfruit"
	on:selected={() => console.log('twice')}
>
	<button slot="placeholderContent">HiddenPremade</button>
</HiddenSelectableInput>
