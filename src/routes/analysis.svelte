<!-- TODO: this route shows many similarities with index, see how it can be modularied -->
<script lang="ts">
	import WeekNames from '$lib/WeekNames.svelte'
	import SummedSetsMatrix from '$lib/SummedSetsMatrix.svelte'
	import { groups, weekNames, selectedGroup } from '$lib/Stores'
	import HiddenAutoCompleteSelector from '$lib/HiddenAutoCompleteSelector.svelte'
	import Model from '$lib/Model.svelte'
	import HoverChange from '$lib/HoverChange.svelte'
	import Icon from '$lib/Icon.svelte'

	import { crossfade } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node)
			const transform = style.transform === 'none' ? '' : style.transform

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
			}
		},
	})

	let model: Model
</script>

<Model bind:this={model} />

<header class="flex justify-between mb-10">
	<h1 class="text-6xl">Set analysis</h1>
	<a
		class="flex py-3 px-4 justify-around items-center bg-green-800 rounded-md"
		href="/"
	>
		<span class="text-2xl text-white font-medium h-min">Set planner</span>
		<span class="w-8 h-8">
			<Icon cls="fill-white" type="arrowRightAlt" />
		</span>
	</a>
</header>
<hr />

<main class="shadow-lg pb-5 rounded-md">
	<nav class="bg-slate-50 flex w-full text-2xl text-center">
		{#each [...$groups.keys()] as groupName}
			<div
				on:click={() => {
					$selectedGroup = groupName
				}}
				class="w-full"
			>
				<div class="py-5">
					<HoverChange
						updatePlaceholder="New group name"
						on:update={(event) =>
							model.updateGroup(groupName, event.detail)}
						on:delete={() => model.deleteGroup(groupName)}
					>
						{groupName}
					</HoverChange>
				</div>
				{#if $selectedGroup == groupName}
					<div
						in:receive={{ key: groupName }}
						out:send={{ key: groupName }}
						class="h-1 bg-black"
					/>
				{/if}
			</div>
		{/each}
		<span class="px-4 w-min my-auto">
			<HiddenAutoCompleteSelector
				placeholder="New group name"
				on:selected={(event) => model.createGroup(event.detail)}
			>
				<span slot="placeholder"> + </span>
			</HiddenAutoCompleteSelector>
		</span>
	</nav>

	<section class="flex flex-col px-4 pt-2 gap-y-3 text-xl">
		{#if $selectedGroup == null}
			<p>Begin by adding a new group!</p>
		{:else}
			<!-- "HACK": dynamically assigned tailwind classes don't really work since unused are removed with postcss be the svelte preprocessor -->
			<div
				class="grid w-full text-center gap-y-3"
				style:grid-template-columns={'repeat(' +
					(1 + $weekNames.size) +
					', minmax(0, 1fr)'}
			>
				<div class="contents font-semibold">
					<div class="text-left">Tags</div>
					<WeekNames />
				</div>
				<SummedSetsMatrix />
			</div>
			<HiddenAutoCompleteSelector
				placeholder="Enter tag name"
				on:selected={(event) => model.createTag(event.detail)}
			/>
		{/if}
	</section>
</main>
