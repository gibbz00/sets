<script lang="ts">
    import {refresh, exercises, groups} from "$lib/Stores"
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte";
    import Model from "$lib/Model.svelte"
    import { onMount } from "svelte";

    export let scenario: "week" | "exercisePlan" | "tag" | "group"
    type addTagParameters = {
        groupName: string,
        exerciseName: string
    }
    export let parameters: addTagParameters | null = null
    // HACK: workaound of svelte bug dissallows the !, ? or as typescript keywords to ensure that certain variables are not nullish
    // The check nullish check is done in onMount()
    let groupName = parameters?.groupName as string
    let exerciseName = parameters?.exerciseName as string
    
    
    let model: Model

    onMount(() => {
        if (scenario == null) throw new Error("Prop scenario must be instansiated.")
        else if (scenario == "tag" && parameters == null) throw new Error(`Add tag scenario must be passed with parameter props`)
    })
</script>

<Model bind:this={model}/>

{#key $refresh}
    {#if scenario == "exercisePlan"}
        <HiddenAutoCompleteSelector placeholder="Add exercise plan" data={Array.from($exercises.keys())} on:selected={(event) => model.createExercisePlan(event.detail)}/>
    {:else if scenario == "week"}
        <HiddenAutoCompleteSelector placeholder="Add week" on:selected={(event) => model.addWeek(event.detail)}/>
    {:else if scenario == "group"}
        <HiddenAutoCompleteSelector placeholder="Enter group name" on:selected={(event) => model.createGroup(event.detail)}/>
    {:else if scenario == "tag"}
        <HiddenAutoCompleteSelector 
            data={Array.from($groups.getDefined((groupName)).values())} 
            placeholder="Add tag" on:selected={(event) => model.addExerciseTag(event.detail, groupName, exerciseName)}
        />
    {/if}
{/key}