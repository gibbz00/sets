<!-- TODO: title automatically added all pages, apart from those where something else is appropriate -->
<svelte:head>
    <title>Sets</title>
</svelte:head>

<!-- TODO: this route shows many similarities with idex, see how it can be modularied -->
<script lang="ts">
    import  WeekNames from "$lib/WeekNames.svelte"
    import SummedSetsMatrix from "$lib/SummedSetsMatrix.svelte"
    import { groups, weekNames, selectedGroup } from "$lib/Stores"
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte";
    import { ThrowSet } from "$lib/utils/ThowSet";

    function createGroup(groupName: string){
        if($groups.has(groupName))  {
            //TODO: show error modal and let user continue typing the group
        }
        else {
           $groups = $groups.set(groupName, new ThrowSet())
        }
    }

</script>


<nav>
    {#each Array.from($groups.keys()) as groupName}
        <span style:text-decoration={$selectedGroup == groupName ? "underline" : ""} on:click={() => {$selectedGroup = groupName}}>{groupName}</span>
    {/each}

    <HiddenAutoCompleteSelector placeholder="Enter group name" on:selected={(event) => createGroup(event.detail)}/>

    <a href="/">Set planner</a>
</nav>

<hr>

<div class="grid" style:--numberWeeks={$weekNames.size}>
    <div>Tags</div>
    <WeekNames />
    <SummedSetsMatrix/>
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(calc(1 + var(--numberWeeks)), 1fr);
    }
</style>