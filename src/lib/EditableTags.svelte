<script lang="ts">
	import { exercises } from '$lib/Stores'
	import Model from '$lib/Model.svelte'
	import PenBinHover from '$lib/PenBinHover.svelte'

	export let exerciseName: string
	export let groupName: string
	let model: Model
</script>

<Model bind:this={model} />

{#each [...$exercises.getDefined(exerciseName).getDefined(groupName)] as tag}
	<span class="inline-block bg-blue-800 p-3 rounded-full text-white font-bold">
		<PenBinHover
			svgClass="fill-white"
			updatePlaceholder="Change tag name"
			on:delete={() => model.deleteExerciseTag(exerciseName, groupName, tag)}
			on:update={(event) => model.updateTag(groupName, tag, event.detail)}
		>
			<span slot="placeholder">{tag}</span>
		</PenBinHover>
	</span>
{/each}
