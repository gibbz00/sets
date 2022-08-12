<script lang="ts">
	import { exercises } from '$lib/Model'
	import Controller from '$lib/Controller.svelte'
	import PenBinHover from '$lib/PenBinHover.svelte'

	export let exerciseName: string
	export let groupName: string
	let controller: Controller
</script>

<Controller bind:this={controller} />

<span class="space-x-1 flex">
	{#each [...$exercises.getDefined(exerciseName).getDefined(groupName)] as tag}
		<div class="bg-green-800 py-1 px-2 rounded-xl text-white font-medium">
			<PenBinHover
				svgClass="fill-white cursor-pointer"
				updatePlaceholder="Change tag name"
				on:delete={() => controller.deleteExerciseTag(exerciseName, groupName, tag)}
				on:update={(event) => controller.updateTag(groupName, tag, event.detail)}
			>
				<div class="w-max" slot="placeholder">{tag}</div>
			</PenBinHover>
		</div>
	{/each}
</span>
