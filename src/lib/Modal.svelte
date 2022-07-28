<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	let dispatch = createEventDispatcher()

	let message: string = ''
	export let toDelete: boolean = false

	export function show(incomingMessage: string) {
		message = incomingMessage
		// HACK: some async code is running when the modal is shown from a HiddenAutoCompleteSelector
		// Not having a timeout results in the modal not showing att all.
		// This works for now but is obviously far from ideal.
		setTimeout(() => {
			dialog.showModal()
		}, 50)
	}

	export function close() {
		dialog.close()
	}

	let dialog: HTMLDialogElement
</script>

<dialog class="p-0 rounded-sm shadow-md backdrop:backdrop-blur-sm" bind:this={dialog}>
	<div class="flex flex-col contents-between w-min">
		<div class="p-6 text-xl">
			{@html message}
		</div>
		<div class="flex">
			{#if toDelete}
				<button
					class={`px-6 py-4 font-medium text-white bg-red-700 hover:bg-red-800 w-max`}
					on:click={() => {
						dialog.close()
						dispatch('delete')
					}}
				>
					Yes, delete
				</button>
			{/if}
			<button
				class="px-6 py-4 font-medium w-max bg-slate-100 hover:bg-slate-200"
				on:click={() => dialog.close()}
			>
				No, cancel
			</button>
		</div>
	</div>
</dialog>
