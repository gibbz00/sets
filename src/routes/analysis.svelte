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
    import type  { MenuComponentDev } from '@smui/menu';
    import List, {Item} from "@smui/list"
    import Icon from "@smui/icon-button"
    import Button from "@smui/button"
    import { onMount } from "svelte";

    let model: Model

    // let optionMenus = new SetMap<string, MenuComponentDev>()
    let optionMenus: {[groupName: string]: MenuComponentDev} = {}
    for (let groupName of $groups.keys()) {
        // Values are propely defined in bind:this=
        optionMenus[groupName] = {} as MenuComponentDev
    }

    const ADD_GROUP_STRING: string = "+"
    function generateTabs(): string[] {
        let tempArray: string[] = Array.from($groups.keys())
        tempArray.push(ADD_GROUP_STRING)
        return tempArray
    }

    let selectedTab: string
    onMount(() => {
        if ($selectedGroup == null) throw new Error("$selectedGroup does not have a default value")
        else {
            selectedTab = $selectedGroup
        }
    })
    function checkSelectedGroupChange(){
        if (selectedTab != ADD_GROUP_STRING) $selectedGroup = selectedTab 
    }
</script>

<Model bind:this={model}/>

<nav>
    <TabBar 
        tabs={generateTabs()} 
        let:tab on:MDCTabBar:activated={checkSelectedGroupChange} bind:active={selectedTab}>
        <Tab {tab}>
            <Label>{tab}</Label>
            {#if tab != ADD_GROUP_STRING}
            <!-- 
                Bugs: 
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
            <div>
                <Button class="clickable-hack" disabled>
                    <Icon class="material-icons" on:click$stopPropagation={() => {optionMenus[tab].setOpen(true)}}>more_vert</Icon>
                </Button>
                <Menu 
                    bind:this={optionMenus[tab]}>
                    <List>
                        <Item>Edit</Item>
                        <Item>Delete</Item>
                    </List>
                </Menu>
            </div>
            {/if}
        </Tab>
    </TabBar>
    <a href="/">Set planner</a>
</nav>


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