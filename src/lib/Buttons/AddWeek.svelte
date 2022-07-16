<script lang="ts">
    import {refresh} from "$lib/Stores"
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte";
    import Model from "$lib/Model.svelte"
    
    let model: Model
</script>

<Model bind:this={model}/>

{#key $refresh}
        <HiddenAutoCompleteSelector placeholder="Add week" on:selected={(event) => model.addWeek(event.detail)}/>
{/key}