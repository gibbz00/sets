<!-- TODO: this route shows many similarities with idex, see how it can be modularied -->
<script lang="ts">
    import  WeekNames from "$lib/WeekNames.svelte"
    import SummedSetsMatrix from "$lib/SummedSetsMatrix.svelte"
    import { groups, weekNames, selectedGroup } from "$lib/Stores"
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte"
    import Model from "$lib/Model.svelte"
    import AddButton from "$lib/Buttons/AddButton.svelte";
    import HoverChange from "$lib/HoverChange.svelte";

    let model: Model
</script>

<Model bind:this={model}/>

<nav>
    {#key $groups }
        {#each Array.from($groups.keys()) as groupName }
            <HoverChange 
                updatePlaceholder="New group name"
                on:update={(event) => model.updateGroup(groupName, event.detail)}
                on:delete={() => model.deleteGroup(groupName)}
            >
                <span style:text-decoration={$selectedGroup == groupName ? "underline" : ""} on:click={() => {$selectedGroup = groupName}}>{groupName}</span>
            </HoverChange>
        {/each}
        <HiddenAutoCompleteSelector placeholder="Enter group name" on:selected={(event) => model.createGroup(event.detail)}/>
    {/key}

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
        <AddButton scenario="tag" /> 
    </div>
{/if}

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(calc(1 + var(--numberWeeks)), 1fr);
    }
</style>