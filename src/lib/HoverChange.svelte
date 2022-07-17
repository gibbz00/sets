<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte"
    let deleteDispatcher: (type: "delete") => boolean = createEventDispatcher()
    let updateDispatcher: (type: "update", detail: string) => boolean = createEventDispatcher()

    let changeIconVisibility: "hidden" | "inherit" = "hidden"
    let optionsVisibility: "hidden" | "inherit" = "hidden"
    let editing: boolean
    let input: string = "" 
    export let updatePlaceholder: null | string
    onMount(() => {
        if (updatePlaceholder == null) throw new Error("Upate placeholder not defined")
    })

    function changeIconShow() { changeIconVisibility = "inherit" }
    function changeIconHide() { changeIconVisibility = "hidden" }

    function optionsShow() { optionsVisibility = "inherit" }
    function optionsHide() { optionsVisibility = "hidden" }

    //Pressing edit changes both slot and change button to input text
        // This input text should have much of the same functionality as the input in autocomplete
            // TODO: merge both inputs?
            // Escape cancels
            // Clicking outside cancels
            // Enter:
                // if input is empty, resets ui
                // if input is non-empty 
                    // dispatch change event and resets ui
    function resetUI() {
        optionsHide()
        editing = false 
        input = ""
    }

    function checkSubmit(event: KeyboardEvent) {
        console.log(event.key)
        switch (event.key) {
            case "Enter":
                if (input != "") {
                    updateDispatcher("update", input)
                }
                resetUI()
                break
            // BUG: this fires on firefox but not on chrome
            case "Escape":
                resetUI()
                break
        }
    }
</script>

<svelte:window on:click={() => {if(optionsVisibility == "inherit" || editing) resetUI()}}/>

{#if editing}
    <input 
        placeholder={updatePlaceholder} 
        on:click|stopPropagation 
        on:keydown={(event) => checkSubmit(event)} 
        bind:value={input}
    >
{:else }
    <span 
        on:mouseenter={changeIconShow} 
        on:focus={changeIconShow} 
        on:mouseleave={changeIconHide}
    >
        <slot></slot>
        <span style:visibility={changeIconVisibility} on:click|stopPropagation={optionsShow}> ⋮ </span>
        <span on:click|stopPropagation style:visibility={optionsVisibility}>
            <span on:click|stopPropagation={() => {editing = true}}>Edit</span>
            <span on:click={() => deleteDispatcher("delete")}>Remove</span>
        </span>
    </span>
{/if}
