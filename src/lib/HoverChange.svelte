<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte"
    let deleteDispatcher: (type: "delete") => boolean = createEventDispatcher()
    let updateDispatcher: (type: "update", detail: string) => boolean = createEventDispatcher()

    let optionsVisibility: "none" | "unset" = "none"
    let editing: boolean = false
    let input: string = "" 
    export let updatePlaceholder: null | string
    onMount(() => {
        if (updatePlaceholder == null) throw new Error("Upate placeholder not defined")
    })

    function optionsShow() { optionsVisibility = "unset" }
    function optionsHide() { optionsVisibility = "none" }

    //Pressing edit changes both slot and change button to input text
        // This input text should have much of the same functionality as the input in autocomplete
            // TODO: make this logic an action
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

<svelte:window on:click={() => {if(optionsVisibility == "unset" || editing) resetUI()}}/>

{#if editing}
    <input 
        placeholder={updatePlaceholder} 
        on:click|stopPropagation 
        on:keydown={(event) => checkSubmit(event)} 
        bind:value={input}
    >
{:else }
    <span class="group flex w-full">
        <slot></slot>
        <span class="hidden group-hover:inline" on:click|stopPropagation={optionsShow}> 
            <slot name="button">
                ⋮ 
            </slot>
        </span>
        <span on:click|stopPropagation style:display={optionsVisibility}>
            <span on:click|stopPropagation={() => {editing = true}}>
                <slot name="edit">
                    Edit
                </slot>
            </span>
            <span on:click={() => deleteDispatcher("delete")}>
                <slot name="delete">
                    Remove
                </slot>
            </span>
        </span>
    </span>
{/if}
