<!-- TODO: title automatically added all pages, apart from those where something else is appropriate -->
<svelte:head>
    <title>Sets</title>
</svelte:head>

<script lang="ts">
    import  WeekNames from "$lib/WeekNames.svelte"
    import { weekNames } from "$lib/SeededStores"
    import { groups } from "$lib/SeededStores"

    //TODO: This logic is quite similar to that of select weekdays in index, check if it can be modularised.
    let selectedGroup: string = $groups.keys().next().value
</script>

<select bind:value={selectedGroup}>
    {#each Array.from($groups.keys()) as groupName}
       <option value={groupName}>{groupName}</option>
    {/each}
</select>

<div class="grid" style:--numberWeeks={$weekNames.size}>
    <div>Tags</div>
    <WeekNames />
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(calc(1 + var(--numberWeeks)), 1fr);
    }

</style>