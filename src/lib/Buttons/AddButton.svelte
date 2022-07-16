<script lang="ts">
    import {refresh, exercises} from "$lib/Stores"
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte";
    import Model from "$lib/Model.svelte"
    import { onMount } from "svelte";

    export let scenario: "week" | "exercise"
    
    let model: Model

    onMount(() => {
        if (scenario == null) throw new Error("Prop scenario must be instansiated.")
    })
</script>

<Model bind:this={model}/>

{#key $refresh}
    {#if scenario == "exercise"}
        <HiddenAutoCompleteSelector placeholder="Add exercise" data={Array.from($exercises.keys())} on:selected={(event) => model.createExercisePlan(event.detail)}/>
    {:else if scenario == "week"}
        <HiddenAutoCompleteSelector placeholder="Add week" on:selected={(event) => model.addWeek(event.detail)}/>
    {/if}
{/key}