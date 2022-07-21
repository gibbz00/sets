<script lang="ts">
    import Tab, { Label } from "@smui/tab"
    import TabBar from "@smui/tab-bar"
    import Menu from "@smui/menu" 
    import type  { MenuComponentDev } from '@smui/menu';
    import List, {Item} from "@smui/list"
    import Icon from "@smui/icon-button"
    import Button from "@smui/button"

    import { groups, selectedGroup } from "$lib/Stores"

    // Would like for this to be a SetMap but limited by svelte or smui
    let optionMenus: {[groupName: string]: MenuComponentDev} = {}
    for (let groupName of $groups.keys()) {
            // Values are propely defined in bind:this=
            optionMenus[groupName] = {} as MenuComponentDev
    }
</script> 

<TabBar 
    tabs={[...$groups.keys()]} 
    let:tab bind:active={$selectedGroup}
>
    <Tab {tab}>
        <Label>{tab}</Label>
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
    </Tab>
</TabBar>