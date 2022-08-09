<script lang="ts">
	import HiddenSelectableInput from '$lib/testSnippets/HiddenSelectableInput.svelte'
	import { autocompleteFilter } from '$lib/testSnippets/autoCompleteFilter'
	import AddButton from '$lib/testSnippets/AddButton.svelte'
	import EllipsisMenu from '$lib/testSnippets/EllipsisMenu.svelte'
	import DropRight from '$lib/testSnippets/DropRight.svelte'
	import ExerciseInfo from '$lib/testSnippets/ExerciseInfo.svelte'

	/*
        Playground for testing snippets in dev environment
        TODO: remove route for production!

        Example of how absolute positioning is not needed
    */

	const dataStub = ['Banana', 'Bluebery', 'Apple', 'Citrusfruits']
</script>

<!-- <div class="grid grid-cols-3 justify-items-center">
	<p>j</p>
	<p>p</p>
	<p>p</p>
	<p>p</p>
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
</div> -->

<!-- <EllipsisMenu
	dynamicWidth
	inputPlaceholderText="New name"
	on:update={(event) => console.log('update', event.detail)}
	on:delete={() => console.log('deleted')}
>
	<div class="w-max" slot="placeholderContent">Bench press</div>
</EllipsisMenu>

<HiddenSelectableInput
	dynamicWidth
	listItems={dataStub}
	listFilter={autocompleteFilter}
	placeholderText="Enter fruit"
	on:selected={(event) => console.log('selected: ', event.detail)}
>
	<AddButton slot="placeholderContent" />
</HiddenSelectableInput> -->

<DropRight>
	<div slot="placeholderContent" class="max-w-sm truncate">Bench press</div>
	<ExerciseInfo slot="dropRightWindow" exerciseName="Bench press" exercisePlanIndex={0} />
</DropRight>
