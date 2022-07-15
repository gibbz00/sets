<script lang="ts">
    /*
        TODO: fully descript component behaviour
        Description:
            * Pressing escape should make autocomplete hidden, also resets data entry
            * Pressing outside also makes autocomplete hidden
    */
    import AutoCompleteSelector from "$lib/AutoCompleteSelector.svelte"
    let hidden: boolean = true

    export let data: string[] = []
    export let placeholder = ""

    function handleKey(event: KeyboardEvent) {
        if (!hidden && event.key == "Escape") hidden = true;
    }
    
</script>

<svelte:window on:keydown={(event) => handleKey(event) } on:click={() => { if(!hidden) hidden = true }}/>

{#if hidden}
    <!-- stopPropagation required, window eventlistener will otherwise close it immediatedly -->
    <span on:click|stopPropagation={() => hidden = !hidden}> + </span>
{:else}
    <span on:click|stopPropagation={() => {}}>
        <AutoCompleteSelector slot="second" {data} {placeholder} on:selected/>  
    </span>
{/if}