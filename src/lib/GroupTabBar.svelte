<script lang="ts">
    import Tab, { Label } from "@smui/tab"
    import TabBar from "@smui/tab-bar"
    import Menu from "@smui/menu" 
    import type  { MenuComponentDev } from '@smui/menu';
    import List, {Item} from "@smui/list"
    import Icon from "@smui/icon-button"
    import Button from "@smui/button"

    import { groups, selectedGroup } from "$lib/Stores"

    import Model from "$lib/Model.svelte"
    let model: Model

    type OptionMenus = {[groupName: string]: 
        {menuComponent: MenuComponentDev, editing: boolean}
    }
    // Would like for this to be a SetMap but limited by svelte or smui
    let optionMenus = (() => {
        let tempObject: OptionMenus = {}
        for (let groupName of $groups.keys()) {
            // Values are propely defined in bind:this=
            tempObject[groupName] = {
                menuComponent: {} as MenuComponentDev,
                editing: false
            }
        }
        return tempObject
    })()

    // This input text should have much of the same functionality as the input in autocomplete
        // TODO: create an use:action logic 
        // Escape cancels
        // Clicking outside cancels
        // Enter:
            // if input is empty, resets ui
            // if input is non-empty 
                // dispatch change event and resets ui
    let input: string
    let activeGroupName: string | undefined

    function checkSubmit(event: KeyboardEvent) {
        switch (event.key) {
            case "Enter":
                if (input != "") {
                    console.log(activeGroupName, input)
                    // model.updateGroup(activeGroupName, input)
                }
                resetUI()
                break
            // BUG: this fires on firefox but not on chrome
            case "Escape":
                resetUI()
                break
        }
    }

    function resetUI() {
        optionMenus[activeGroupName!].editing = false
        input = ""
        activeGroupName = undefined
    }
</script> 

<Model bind:this={model} />

<svelte:window 
    on:click={() => {
        if(optionMenus[activeGroupName].menuComponent.open == false) {
            resetUI()
        }
    }}
/>

<TabBar 
    tabs={[...$groups.keys()]} 
    let:tab bind:active={$selectedGroup}
>
    <Tab {tab}>
        <!-- TEST -->
        {#if optionMenus[tab].editing}
            <input 
                on:click|stopPropagation
                on:keydown={(event) => checkSubmit(event)}
                bind:value={input}
                type="text" 
                placeholder="Change group name"
            >
        {:else}
            <Label>{tab}</Label>
        {/if}
        <div>
            <Button class="clickable-hack" disabled>
                <Icon class="material-icons" on:click$stopPropagation={() => {optionMenus[tab].menuComponent.setOpen(true)}}>more_vert</Icon>
            </Button>
            <Menu 
                bind:this={optionMenus[tab].menuComponent}>
                <List>
                    <Item
                        on:click={() => {
                            optionMenus[tab].editing = true
                            activeGroupName = tab;
                        }} 
                    >
                        Edit
                    </Item>
                    <Item>Delete</Item>
                </List>
            </Menu>
        </div>
    </Tab>
</TabBar>
