<script lang="ts">
	import { weekNames } from '$lib/Model'
	import Controller from '$lib/Controller.svelte'
	import HoverChange from '$lib/HoverChange.svelte'
	import HiddenAutoCompleteSelector from '$lib/HiddenAutoCompleteSelector.svelte'

	let controller: Controller
</script>

<Controller bind:this={controller} />

{#each [...$weekNames.values()] as weekName, index}
	<HoverChange
		updatePlaceholder="New week name"
		absoluteInputPositioning
		inputStyling="border-2 border-yellow-500"
		on:update={(event) => controller.updateWeek(weekName, event.detail)}
		on:delete={() => controller.deleteWeek(weekName, index)}
	>
		{weekName}
		<!-- WORK-AROUND for svelte conditional slots: https://github.com/sveltejs/svelte/issues/5604 -->
		<svelte:fragment slot="non-relative">
			{#if index == $weekNames.size - 1}
				<div class="ml-20 mr-6 w-min">
					<HiddenAutoCompleteSelector
						inputStyling="text-center border-2 border-yellow-500"
						placeholder="Add week"
						on:selected={(event) => controller.createWeek(event.detail)}
					/>
				</div>
			{/if}
		</svelte:fragment>
	</HoverChange>
{/each}
