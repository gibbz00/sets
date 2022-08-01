<script lang="ts">
	/* 
    Combines Hidden.svelte uses it with SelectableInput.svelte

     Test:
      * Enter on empty input dispatches resetUI
      * Passes up selected event 
      * Can pass down input value
    */

	import Hidden from './Hidden.svelte'
	import SelectableInput from './SelectableInput.svelte'
</script>

<Hidden>
	<SelectableInput slot="hiddenContent" on:selected />
</Hidden>
