<script lang="ts">
	import Hidden from './Hidden.svelte'
	import SelectableInput from './SelectableInput.svelte'

	/* 
    Combines Hidden.svelte uses it with SelectableInput.svelte

     Test:
      * Both cancelation and selection hide input (done)
      * Passes up selected event (done)
      * Shown input is autofocused (done)
  */
	export let placeholderText: string = ''

	// Bound to Hidden component in order to hide when a selected or canceled event is recieved
	let hidden: boolean = true
</script>

<Hidden bind:hidden>
	<slot slot="placeholderContent" name="placeholderContent" />
	<slot slot="optionalRevealTarget" name="optionalRevealTarget" />
	<SelectableInput
		autofocus
		slot="hiddenContent"
		on:seected={() => (hidden = true)}
		on:canceled={() => (hidden = true)}
		on:selected
		{placeholderText}
	/>
</Hidden>
