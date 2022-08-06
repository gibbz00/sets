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

	export let listItems: SelectableInput['listItems'] = undefined
	// Defealt filter is to show every list item
	export let listFilter: SelectableInput['listFilter'] = undefined
	export let dynamicWidth: boolean = false

	// Bound to Hidden component in order to hide when a selected or canceled event is recieved
	let hidden: boolean = true
</script>

<Hidden bind:hidden>
	<slot slot="placeholderContent" name="placeholderContent" />
	<slot slot="optionalRevealTarget" name="optionalRevealTarget" />
	<SelectableInput
		autofocus
		{dynamicWidth}
		slot="hiddenContent"
		on:selected={() => (hidden = true)}
		on:canceled={() => (hidden = true)}
		on:selected
		{placeholderText}
		{listItems}
		{listFilter}
	/>
</Hidden>
