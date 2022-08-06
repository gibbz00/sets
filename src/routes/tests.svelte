<script lang="ts">
	import Hidden from '$lib/testSnippets/Hidden.svelte'

	import HiddenAutoComplete from '$lib/testSnippets/HiddenAutoComplete.svelte'
	import HiddenSelectableInput from '$lib/testSnippets/HiddenSelectableInput.svelte'
	import SelectableInput from '$lib/testSnippets/SelectableInput.svelte'

	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!
    */

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']
</script>

<!-- <HiddenAutoComplete data={dataStub} placeholderText="Enter fruit" /> -->

<SelectableInput on:selected={() => console.log('yikes')} />

<Hidden>
	<button slot="placeholderContent">Hidden</button>
	<div slot="hiddenContent">
		<SelectableInput on:selected={() => console.log('yike')} />
	</div>
</Hidden>

<HiddenSelectableInput on:selected={() => console.log('twice')}>
	<button slot="placeholderContent">HiddenPremade</button>
</HiddenSelectableInput>
