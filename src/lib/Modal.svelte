<script lang="ts">
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

<dialog bind:this={dialog}>
	{message}
	<slot name="deleteButton" />
	<form method="dialog">
		<button>Close</button>
	</form>
</dialog>
