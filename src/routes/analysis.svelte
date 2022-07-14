<!-- TODO: title automatically added all pages, apart from those where something else is appropriate -->
<svelte:head>
    <title>Sets</title>
</svelte:head>

<!-- TODO: this route shows many similarities with idex, see how it can be modularied -->
<script lang="ts">
    import  WeekNames from "$lib/WeekNames.svelte"
    import SummedSetsMatrix from "$lib/SummedSetsMatrix.svelte"
    import { groups, weekNames, selectedGroup } from "$lib/Stores"
</script>

<select bind:value={$selectedGroup}>
    {#each Array.from($groups.keys()) as groupName}
       <option value={groupName}>{groupName}</option>
    {/each}
</select>

<a href="/">Set planner</a>

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