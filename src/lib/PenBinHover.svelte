<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte"
    let deleteDispatcher: (type: "delete") => boolean = createEventDispatcher()
    let updateDispatcher: (type: "update", detail: string) => boolean = createEventDispatcher()

    let editing: boolean = false
    let input: string = "" 
    export let updatePlaceholder: null | string
    onMount(() => {
        if (updatePlaceholder == null) throw new Error("Upate placeholder not defined")
    })

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

<svelte:window on:click={() => { if(editing) resetUI() }}/>

<span class="group-two">
    <span class="group-two-hover:hidden" style:display={editing ? "none" : ""}>
        <slot name="placeholder"></slot>
    </span>
    <span class="hidden" style:display={editing ? "inline-block" : "none"}>
        <input 
            on:keydown={(event) => checkSubmit(event)} 
            on:click|stopPropagation
            bind:value={input}
            class="text-black" 
            type="text"
        >
    </span>
    <span class="hidden group-two-hover:flex">
        <div class="contents" style:display={editing ? "none" : ""}>
            <!-- Pen -->
            <svg 
                on:click|stopPropagation={() => editing = true}
                class="w-7 h-7 fill-white" 
                xmlns="http://www.w3.org/2000/svg" 
                height="48" 
                width="48" 
                viewBox="0 0 48 48"
            >
                <path d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/>
            </svg>

            <!-- Bin -->
            <svg 
                on:click={() => deleteDispatcher("delete")}
                class="w-7 h-7 fill-white" 
                xmlns="http://www.w3.org/2000/svg" 
                height="48" 
                width="48" 
                viewBox="0 0 48 48"
            >
                <path d="M13.05 42q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm21.9-31.5h-21.9V39h21.9Zm-16.6 24.2h3V14.75h-3Zm8.3 0h3V14.75h-3Zm-13.6-24.2V39Z"/>
            </svg>
        </div>
    </span>
</span>