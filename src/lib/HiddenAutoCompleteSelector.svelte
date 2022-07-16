<script lang="ts">
    /*
        Description:
            * Pressing escape should make autocomplete hidden, also resets data entry
            * Pressing outside also makes autocomplete hidden
            1. Case-sensitive whole pattern matching starting only at first index  
            2. Abilitity to select based on input or based on shown matches
                2.1 Selection dispatches a SelectedEvent to parent component
            TODO: 3. Shows options if component is in focus
    */

    // Event dispatcher setup
    import { createEventDispatcher } from "svelte"
    // Detail should be input value
    // TODO: use typesetting to program this in
    const dispatch: (type: "selected", detail: string) => boolean = createEventDispatcher()

    // Flexibilty for feature extention of wht data-types the component can handle
    type element = string

    let hidden: boolean = true

    // Text-area live value
    let input = "" 
    // Array of objects that match the input 
    let remaining: element[] = [];

    // TODO: typeset to whole numbers greater than -1 and always less than remaining.length
    // -1 symbolises unset
    let selectedIndex: number = -1


    // data - array of matches to compare input with
    export let data: element[] = []
    export let placeholder: string = ""


    let inputElement: HTMLInputElement
    function filterData(){
        if (input.length == 0){
            remaining = data;
        }
        else {
            let tempRemaining = data
            for(let index = 0; index < input.length; index++){
                tempRemaining = tempRemaining.filter((element) => {
                    if (element.charAt(index) == input.charAt(index)) {
                        return element
                    }
                })
            }
            remaining = tempRemaining
        }
    }

    // BUG: svelte bug: can't use "as" keyword in anonymous callback functions witten outside of script tag
    function filterDataPrepare(event: Event) {
        input = (event.target as HTMLInputElement).value
        filterData()
    }

    // 
    function checkSubmit(event: KeyboardEvent){
        switch (event.key) {
            case "Enter":
                if (input != "") {
                    inputElement.blur()
                    dispatch("selected", input)
                    break
                }
            case "Escape":
                hidden = true
                break
            case "ArrowUp":
                if (selectedIndex > 0 ) input = remaining[--selectedIndex]
                break
            case "ArrowDown":
                if (data == undefined && selectedIndex == -1) {
                    filterData()
                    selectedIndex = 0
                    input = remaining[selectedIndex]
                } 
                else if (selectedIndex < remaining.length - 1) input = remaining[++selectedIndex]
                break
        }
    }
</script>

<svelte:window on:click={() => { if(!hidden) hidden = true }}/>

{#if hidden}
    <!-- stopPropagation required, window eventlistener will otherwise close it immediatedly -->
    <span on:click|stopPropagation={() => hidden = !hidden}> + </span>
{:else}
    <span on:click|stopPropagation={() => {}}>
        <!-- bind:input not used since eventlistener is fired first anyway, creates a bug in all the data is shown before any input has been made -->
        <!-- beforeinput event is used in order to capture line-break keypress, which are captured by on:input-->
        <input bind:this={inputElement} type="text" autocomplete="off" {placeholder} on:keydown={(event) => checkSubmit(event)} on:input={(event) => filterDataPrepare(event)} value={input}>
        {#if remaining.length > 0}
            <ul>
                {#each remaining as element, index}
                    <li class={index == selectedIndex ? "selected" : undefined} on:click={() => dispatch("selected", element)}>{element}</li>
                {/each}
            </ul>
        {/if}
    </span>
{/if}

<style>
    .selected {
        color: red;
    }
</style>