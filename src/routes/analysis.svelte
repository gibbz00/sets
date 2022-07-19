<!-- TODO: this route shows many similarities with idex, see how it can be modularied -->
<script lang="ts">
    import  WeekNames from "$lib/WeekNames.svelte"
    import SummedSetsMatrix from "$lib/SummedSetsMatrix.svelte"
    import { groups, weekNames, selectedGroup } from "$lib/Stores"
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte"
    import Model from "$lib/Model.svelte"
    import AddButton from "$lib/Buttons/AddButton.svelte";
    import HoverChange from "$lib/HoverChange.svelte";
    import TabBar from "@smui/tab-bar"
    import Tab, { Label } from "@smui/tab"
    import Menu from "@smui/menu" 
    import type { MenuComponentDev } from '@smui/menu';
    import List, {Item, Text} from "@smui/list"
    import IconButton from "@smui/icon-button"
    import Button from "@smui/button"

    let model: Model
    let optionsMenu: MenuComponentDev
</script>

<Model bind:this={model}/>

<nav>
    <TabBar tabs={Array.from($groups.keys())} let:tab bind:active={$selectedGroup}>
        <Tab {tab} on:click={(event) => console.log("test", event.target)} ripple={false}>
                <Label on:click={() => console.log("pest")}>{tab}</Label>
        </Tab>
        <IconButton class="material-icons" on:click={() => {optionsMenu.setOpen(true); console.log("registered")}}>more_vert</IconButton>
    </TabBar>
    <a href="/">Set planner</a>
</nav>

<Menu static bind:this={optionsMenu}>
    <List>
        <Item>Edit</Item>
        <Item>Delete</Item>
    </List>
</Menu>


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
    nav {
        display: flex;
        align-items: center;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(calc(1 + var(--numberWeeks)), 1fr);
    }
</style>