<script lang="ts">
    import { createEventDispatcher } from "svelte";


    let visibility: "hidden" | "initial" = "hidden"

    function showDelete(){
        visibility = "initial"
    }

    function hideDelete(){
        visibility = "hidden"
    }

    let dispatcher = createEventDispatcher()
    function dispatchRemove(){
        dispatcher("remove")
    }
</script>

<span on:mouseenter={showDelete} on:focus={showDelete} on:mouseleave={hideDelete}>
    <slot></slot>
    <span style:visibility on:click={dispatchRemove}>
        X
    </span>
</span>
