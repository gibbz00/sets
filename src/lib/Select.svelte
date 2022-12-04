<script lang="ts">
    /*
        * Placeholder can be supplied as a string (similar to HTMLSelectElement),
          or as slot (to allow for nested components/elements).
    */
	import { SvelteComponentTyped } from "svelte"
	import InteractiveList from "./InteractiveList.svelte"
	import PopMenu from "./PopMenu.svelte"
	import type { SelectedEventDetail } from "./utils/TypeStub"

    export let placeholder: string = ''
    export let options: (InteractiveList extends SvelteComponentTyped<infer Props> ? Props : never)['listOptions']['items']

    let opened: boolean
    function selectedHandler(detail: SelectedEventDetail) {
        if (detail.method == 'selection') opened = false
    }
</script>

<PopMenu 
    bind:opened={opened}
    menuPosition="below"
    class="p-2 rounded-md"
>
    <slot slot="placeholderContent" name="placeholder">
        {placeholder}
    </slot>

    <InteractiveList slot="popMenuWindow"
        bind:itemsShown={opened}
        listOptions={{items: options}}
        selectOnTraverse
        hideOnSelection
        on:selected={(event) => selectedHandler(event.detail)}
        on:selected
    />
</PopMenu>