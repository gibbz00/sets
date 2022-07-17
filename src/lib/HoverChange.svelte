<script lang="ts">
    import { createEventDispatcher } from "svelte"
    let dispatcher: (type: "update" | "delete") => boolean = createEventDispatcher()

    let changeIconVisibility: "hidden" | "inherit" = "hidden"
    let optionsVisibility: "hidden" | "inherit" = "hidden"

    function changeIconShow() {
        changeIconVisibility = "inherit"
    }

    function changeIconHide() {
        changeIconVisibility = "hidden"
    }

    function optionsShow() {
        optionsVisibility = "inherit"
    }

    function optionsHide() {
        optionsVisibility = "hidden"
    }
</script>

<svelte:window on:click={() => {if(optionsVisibility == "inherit") optionsHide()}}/>

<span on:mouseenter={changeIconShow} on:focus={changeIconShow} on:mouseleave={changeIconHide}>
    <slot></slot>
    <span style:visibility={changeIconVisibility} on:click|stopPropagation={optionsShow}>⋮</span>
    <span on:click|stopPropagation style:visibility={optionsVisibility}>
        <span on:click={() => dispatcher("update")}>Edit</span>
        <span on:click={() => dispatcher("delete")}>Remove</span>
    </span>
</span>
