<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	let dispatch = createEventDispatcher()

	let message: string = ''

	export function show(incomingMessage: string) {
		message = incomingMessage
		dialog.showModal()
	}

	export function close() {
		dialog.close()
	}

	let dialog: HTMLDialogElement
</script>

<dialog class="p-0 shadow-md backdrop:backdrop-blur-sm" bind:this={dialog}>
	<div class="flex flex-col contents-between w-min">
		<div class="p-6 text-xl">
			{@html message}
		</div>
		<div class="flex">
			{#if $$props.delete}
				<button
					class="px-6 py-4 font-medium text-white bg-red-700 hover:bg-red-800 w-max"
					on:click={() => dispatch('delete')}>Yes, delete</button
				>
			{/if}
			<button
				class="px-6 py-4 font-medium w-max bg-slate-100 hover:bg-slate-200"
				on:click={() => dialog.close()}>No, cancel</button
			>
		</div>
	</div>
</dialog>
