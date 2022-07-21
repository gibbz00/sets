<!-- TODO: this route shows many similarities with idex, see how it can be modularied -->
<script lang="ts">
    import  WeekNames from "$lib/WeekNames.svelte"
    import SummedSetsMatrix from "$lib/SummedSetsMatrix.svelte"
    import { groups, weekNames, selectedGroup } from "$lib/Stores"
    import HiddenAutoCompleteSelector from "$lib/HiddenAutoCompleteSelector.svelte"
    import Model from "$lib/Model.svelte"
    import AddButton from "$lib/Buttons/AddButton.svelte";
    import HoverChange from "$lib/HoverChange.svelte";
    import Tab, { Label } from "@smui/tab"
    import TabBar from "@smui/tab-bar"
    import Menu from "@smui/menu" 
    import type { MenuComponentDev } from '@smui/menu';
    import List, {Item} from "@smui/list"
    import Icon from "@smui/icon-button"
    import Button from "@smui/button"

    let model: Model
    let optionsMenu: MenuComponentDev
</script>

<Model bind:this={model}/>

<nav>
    <TabBar tabs={Array.from($groups.keys())} let:tab bind:active={$selectedGroup}>
        <Tab {tab}>
            <Label>{tab}</Label>
            <!-- 
                Bugs: 
                    * content of tabs are clickable, this is due to MDC-tab implementation, not smui
                        * FIX: css z-index = 1 and pointer-events = auto properties
                    * color="secondary" does not work on IconButton
                        * FIX: Icon explicitly wrapped in button component
                            * Leads to visible button and hover effect 
                                * FIX: has ripple = false prop and added a clickable-hack:hover > div selector to target the ripple class
            -->
            <Button class="clickable-hack" color="secondary" ripple={false}>
                <Icon class="material-icons" on:click$stopPropagation={() => {optionsMenu.setOpen(true); console.log("registered")}}>more_vert</Icon>
            </Button>
        </Tab>
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
    * :global(.clickable-hack){
        pointer-events: all;
        z-index: 1;
    }

    * :global(.clickable-hack:hover > div) {
        opacity: 0;
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