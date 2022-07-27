<script lang="ts">
	import { weekNames } from '$lib/Stores'
	import Model from '$lib/Model.svelte'
	import HoverChange from '$lib/HoverChange.svelte'
	import HiddenAutoCompleteSelector from '$lib/HiddenAutoCompleteSelector.svelte'

	let model: Model
</script>

<Model bind:this={model} />

{#each [...$weekNames.values()] as weekName, index}
	<HoverChange
		updatePlaceholder="New week name"
		absoluteInputPositioning
		on:update={(event) => model.updateWeek(weekName, event.detail)}
		on:delete={() => model.deleteWeek(weekName, index)}
	>
		{weekName}
		<!-- WORK-AROUND for svelte conditional slots: https://github.com/sveltejs/svelte/issues/5604 -->
		<svelte:fragment slot="non-relative">
			{#if index == $weekNames.size - 1}
				<div class="ml-20 mr-6 w-min">
					<HiddenAutoCompleteSelector
						placeholder="Add week"
						textAlign="center"
						on:selected={(event) => model.createWeek(event.detail)}
					>
						<button
							slot="placeholder"
							class="w-8 text-center rounded-full hover:bg-slate-100/50"
						>
							+
						</button>
					</HiddenAutoCompleteSelector>
				</div>
			{/if}
		</svelte:fragment>
	</HoverChange>
{/each}
