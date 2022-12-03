<script lang="ts">
	import { weekNames } from '$lib/Model'
	import EllipsisMenu from './EllipsisMenu.svelte'
	import Controller from './Controller.svelte'
	import HiddenSelectableInput from '$lib/HiddenSelectableInput.svelte'
	import AddButton from './AddButton.svelte'
	import { onMount } from 'svelte'

	let controller: Controller

	onMount(() => {
		if (!$$slots.headerColumnOne) {
			console.warn('No slot for column one in header has been provided.')
		}
		if (!$$slots.body) {
			console.warn('No slot for the body has been provided.')
		}
	})
</script>

<Controller bind:this={controller} />

<div
	class="grid items-center text-xl gap-y-3"
	style:grid-template-columns={`minmax(10rem, min-content) repeat(${$weekNames.size}, 1fr) min-content`}
>
	<!-- Table header: Exercise title and week names -->
	<div class="contents text-2xl">
		<div class="pl-3">
			<slot name="headerColumnOne" />
		</div>
		{#each [...$weekNames.values()] as weekName, index}
			<div class="justify-self-center">
				<EllipsisMenu
					dynamicWidth
					inputPlaceholderText="New week name"
					on:update={(event) => controller.updateWeek(weekName, event.detail)}
					on:delete={() => controller.deleteWeek(weekName, index)}
				>
					<svelte:fragment slot="placeholderContent">
						{weekName}
					</svelte:fragment>
				</EllipsisMenu>
			</div>
		{/each}
		<!-- Add week button -->
		<div class="pr-3">
			<HiddenSelectableInput
				placeholderText="Add week"
				on:selected={(event) => controller.createWeek(event.detail.selected)}
			>
				<AddButton slot="placeholderContent" />
			</HiddenSelectableInput>
		</div>
	</div>
	<!-- Header separator -->
	<hr class="max-h-1 row-start-2 my-1 col-span-full" />
	<slot name="body" />
</div>
<slot name="footer" />
