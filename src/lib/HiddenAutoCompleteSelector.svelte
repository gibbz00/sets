<script lang="ts">
    import AutoCompleteSelector from "$lib/AutoCompleteSelector.svelte"
    let hidden: boolean = true

    export let data: string[] = []
    export let placeholder = ""
</script>

{#if hidden}
    <span on:click={() => hidden = !hidden}> + </span>
{:else}
    <AutoCompleteSelector slot="second" {data} {placeholder} on:selected/>  
{/if}