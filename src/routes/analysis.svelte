<!-- TODO: this route shows many similarities with idex, see how it can be modularied -->
<script lang="ts">
    import  WeekNames from "$lib/WeekNames.svelte"
    import SummedSetsMatrix from "$lib/SummedSetsMatrix.svelte"
    import { groups, weekNames, selectedGroup } from "$lib/Stores"
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte"
    import Model from "$lib/Model.svelte"
    import AddButton from "$lib/Buttons/AddButton.svelte";
    import HoverChange from "$lib/HoverChange.svelte";
    import GroupTabBar from "$lib/GroupTabBar.svelte"

    let model: Model

</script>

<Model bind:this={model}/>

{#key $groups}
    <nav>
        <GroupTabBar />
        <HiddenAutoCompleteSelector placeholder="Enter group name" on:selected={(event) => model.createGroup(event.detail)}/>
        <a href="/">Set planner</a>
    </nav>
{/key}

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
    {/key}
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

<!-- 
    SMUI tab-bar bugs: 
        * content of tabs are clickable, this is due to MDC-tab implementation, not smui
            * FIX: css z-index = 1 and pointer-events = auto properties
        * color="secondary" does not work on IconButton
            * HACK: Icon explicitly wrapped in button component that is disabled
                * Makes it grey only
                    * color="secondary" with an enabled button created hover tabbing issues 
        * Menu cropped by tab
            * FIX: 
                * mdc-tab-scroller must have overflow: visible
                * .mdc-tab-scroller__scroll-area--scroll must have overflow-x: visible
-->
<style>
    * :global(.clickable-hack){
        pointer-events: all;
        z-index: 1;
    }
    * :global(.mdc-tab__content){
        pointer-events: all;
        z-index: 2;
    }

    * :global(.clickable-hack:hover .mdc-button__ripple) {
        opacity: 0;
    }

    * :global(.mdc-tab-scroller) {
        overflow: visible;
    }

    * :global(.mdc-tab-scroller__scroll-area--scroll) {
        overflow-x: visible;
    }

    nav {
        display: flex;
        align-items: center;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(calc(1 + var(--numberWeeks)), 1fr);
    }
</style>