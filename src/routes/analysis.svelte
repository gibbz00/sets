<!-- TODO: title automatically added all pages, apart from those where something else is appropriate -->
<svelte:head>
    <title>Sets</title>
</svelte:head>

<!-- TODO: this route shows many similarities with idex, see how it can be modularied -->
<script lang="ts">
    import  WeekNames from "$lib/WeekNames.svelte"
    import SummedSetsMatrix from "$lib/SummedSetsMatrix.svelte"
    import { groups, weekNames, selectedGroup } from "$lib/Stores"
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte"
    import HoverDelete from "$lib/HoverDelete.svelte"
    import Model from "$lib/Model.svelte"

    let model: Model
</script>

<Model bind:this={model}/>

<nav>
    {#key $groups }
        {#each Array.from($groups.keys()) as groupName}
            <HoverDelete on:remove={() => model.deleteGroup(groupName)}>
                <span style:text-decoration={$selectedGroup == groupName ? "underline" : ""} on:click={() => {$selectedGroup = groupName}}>{groupName}</span>
            </HoverDelete>
        {/each}
    {/key}

    <HiddenAutoCompleteSelector placeholder="Enter group name" on:selected={(event) => model.createGroup(event.detail)}/>

    <a href="/">Set planner</a>
</nav>

<hr>

{#if $selectedGroup == null }
    <p>Begin by adding a new group!</p>
{:else}
    <div class="grid" style:--numberWeeks={$weekNames.size}>
        <div>Tags</div>
        <WeekNames />
        <SummedSetsMatrix/>
    </div>
{/if}


<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(calc(1 + var(--numberWeeks)), 1fr);
    }
</style>