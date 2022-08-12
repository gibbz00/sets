<script lang="ts">
	import { refresh, exercises, groups } from '$lib/Model'
	import HiddenAutoCompleteSelector from '$lib/HiddenAutoCompleteSelector.svelte'
	import { onMount } from 'svelte'
	import Controller from '$lib/Controller.svelte'

	export let scenario: 'week' | 'exercisePlan' | 'exerciseTag' | 'group' | 'tag'
	type addTagParameters = {
		groupName: string
		exerciseName: string
	}
	export let parameters: addTagParameters | null = null
	// HACK: workaound of svelte bug dissallows the !, ? or as typescript keywords to ensure that certain variables are not nullish
	// The check nullish check is done in onMount()
	let groupName = parameters?.groupName as string
	let exerciseName = parameters?.exerciseName as string

	let controller: Controller

	onMount(() => {
		if (scenario == null) throw new Error('Prop scenario must be instansiated.')
		else if (scenario == 'exerciseTag' && parameters == null)
			throw new Error(`Add tag scenario must be passed with parameter props`)
	})
</script>

<Controller bind:this={controller} />

{#key $refresh}
	{#if scenario == 'group'}
		<HiddenAutoCompleteSelector
			placeholder="Enter group name"
			on:selected={(event) => controller.createGroup(event.detail)}
		>
			<span slot="placeholder">Add group +</span>
		</HiddenAutoCompleteSelector>
	{:else if scenario == 'exerciseTag'}
		<HiddenAutoCompleteSelector
			data={Array.from($groups.getDefined(groupName).values())}
			placeholder="Add tag"
			on:selected={(event) =>
				controller.createExerciseTag(event.detail, groupName, exerciseName)}
		/>
	{/if}
{/key}
