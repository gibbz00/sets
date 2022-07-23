<!-- TODO: this route shows many similarities with index, see how it can be modularied -->
<script lang="ts">
	import WeekNames from '$lib/WeekNames.svelte'
	import SummedSetsMatrix from '$lib/SummedSetsMatrix.svelte'
	import { groups, weekNames, selectedGroup } from '$lib/Stores'
	import HiddenAutoCompleteSelector from '$lib/HiddenAutoCompleteSelector.svelte'
	import Model from '$lib/Model.svelte'
	import HoverChange from '$lib/HoverChange.svelte'
	import Icon from '$lib/Icon.svelte'

	let model: Model
</script>

<Model bind:this={model} />

<header class="flex justify-between mb-10">
	<h1 class="text-6xl">Set analysis</h1>
	<a class="flex py-3 px-4 justify-around items-center bg-green-800 rounded-md" href="/">
		<span class="text-2xl text-white font-medium h-min">Set planner</span>
		<span class="w-8 h-8">
			<Icon type="arrowRightAlt" />
		</span>
	</a>
</header>
<hr />

<nav class="flex text-2xl text-center">
	{#key $groups}
		{#each Array.from($groups.keys()) as groupName}
			<HoverChange
				updatePlaceholder="New group name"
				on:update={(event) => model.updateGroup(groupName, event.detail)}
				on:delete={() => model.deleteGroup(groupName)}
			>
				<div
					class="w-full"
					style:border-bottom-width={$selectedGroup == groupName ? '4px' : ''}
					on:click={() => {
						$selectedGroup = groupName
					}}
				>
					{groupName}
				</div>
			</HoverChange>
		{/each}
		<HiddenAutoCompleteSelector placeholder="Enter group name" on:selected={(event) => model.createGroup(event.detail)}>
			<span slot="placeholder" class="basis-1/6"> + </span>
		</HiddenAutoCompleteSelector>
	{/key}
</nav>

<main class="flex px-4 pt-2 text-xl">
	{#if $selectedGroup == null}
		<p>Begin by adding a new group!</p>
	{:else}
		<!-- "HACK": dynamically assigned tailwind classes don't really work since unused are removed with postcss be the svelte preprocessor -->
		<div class="grid w-full text-center gap-y-3" style:grid-template-columns={'repeat(' + (1 + $weekNames.size) + ', minmax(0, auto)'}>
			<div class="text-left w-max">Tags</div>
			<WeekNames />
			<SummedSetsMatrix />
		</div>
		<HiddenAutoCompleteSelector placeholder="Enter tag name" on:selected={(event) => model.createTag(event.detail)} />
	{/if}
</main>
