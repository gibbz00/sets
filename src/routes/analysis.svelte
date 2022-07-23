<!-- TODO: this route shows many similarities with index, see how it can be modularied -->
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

<nav class="flex text-2xl text-center">
    {#key $groups }
        {#each Array.from($groups.keys()) as groupName }
            <HoverChange 
                updatePlaceholder="New group name"
                on:update={(event) => model.updateGroup(groupName, event.detail)}
                on:delete={() => model.deleteGroup(groupName)}
            >
                <div 
                    class="w-full" 
                    style:border-bottom-width={$selectedGroup == groupName ? "4px" : ""} 
                    on:click={() => {$selectedGroup = groupName}}
                >
                    {groupName}
                </div>
            </HoverChange>
        {/each}
        <HiddenAutoCompleteSelector placeholder="Enter group name" on:selected={(event) => model.createGroup(event.detail)}/>
    {/key}

    <a class="w-full" href="/">Set planner</a>
</nav>

<hr>

<main class="pl-4 pt-2 text-xl flex">
    {#if $selectedGroup == null }
        <p>Begin by adding a new group!</p>
    {:else}
    <!-- "HACK": dynamically assigned tailwind classes don't really work since unused are removed with postcss be the svelte preprocessor -->
    <div 
        class="grid text-center gap-y-3 w-full"
        style:grid-template-columns={"repeat(" + (1 + $weekNames.size) + ", minmax(0, auto)"}
    >
        <div class="w-max text-left">Tags</div>
        <WeekNames />
        <SummedSetsMatrix/>
    </div>
    <HiddenAutoCompleteSelector placeholder="Enter tag name" on:selected={(event) => model.createTag(event.detail)} />
    {/if}
</main>