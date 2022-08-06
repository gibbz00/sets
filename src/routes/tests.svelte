<script lang="ts">
	import SelectableInput from '$lib/testSnippets/SelectableInput.svelte'
	import Hidden from '$lib/testSnippets/Hidden.svelte'
	import HiddenSelectableInput from '$lib/testSnippets/HiddenSelectableInput.svelte'

	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!
    */

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']

	function autocompleteFilter(textFieldValue: string, items: string[]): string[] {
		/*
            Description:
                * Autoselect option
                    * Case-sensitive whole pattern based on textFieldValue 
                    * Match starts only at first index 
                    * Empty input means that every element is a potential match
        */

		// Then we iterate over each letter of the input and pick only those match charachter-wise
		let potentialMatches: string[] = items
		for (let index = 0; index < textFieldValue.length; index++) {
			potentialMatches = potentialMatches.filter((potentialMatch) => {
				if (potentialMatch.charAt(index) == textFieldValue.charAt(index)) {
					return potentialMatch
				}
			})
		}
		return potentialMatches
	}
</script>

<!-- <HiddenAutoComplete data={dataStub} placeholderText="Enter fruit" /> -->

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
