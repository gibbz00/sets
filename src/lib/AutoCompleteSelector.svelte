<script lang="ts">
    /*
        Description:
            1. Case-sensitive whole pattern matching starting only at first index  
            2. Abilitity to select based on input or based on shown matches
                2.1 Selection dispatches a SelectedEvent to parent component
            TODO: 3. Shows options if component is in focus
    */

    // Flexibilty for feature extention of wht data-types the component can handle
    type element = string

    // data - array of matches to compare input with
    export let data: element[] = []
    export let placeholder: string | undefined

    // Text-area live value
    let input = "" 
    // Array of objects that match the input 
    let remaining: element[] = [];

    // Event dispatcher setup
    import { createEventDispatcher } from "svelte"
    // Detail should be input value
    // TODO: use typesetting to program this in
    const dispatch: (type: "selected", detail: string) => boolean = createEventDispatcher()

    /*
        TODO:
            1. pressing enter should invoke 2.
            3. clicking on a li invokes 2.
            4. pressing key/up or down should focus on a list-item
                4.1 pressing key-down when ul length is 0 does not shift focus
                4.2 pressing enter on a focused li invokes 2.
    */


    let inputElement: HTMLInputElement

    function filterData(event: Event){
        input = (event as any).target.value
       
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

    function checkSubmit(event: InputEvent){
        if (event.inputType == "insertLineBreak") {
            inputElement.blur()
            dispatch("selected", input)
        }
    }
</script>

<!-- bind:input not used since eventlistener is fired first anyway, creates a bug in all the data is shown before any input has been made -->
<!-- beforeinput event is used in order to capture line-break keypress, which are captured by on:input-->
<input bind:this={inputElement} type="text" autocomplete="off" {placeholder} on:beforeinput={(event) => checkSubmit(event)} on:input={(event) => filterData(event)} value={input}>
{#if remaining.length > 0}
    <ul>
        {#each remaining as element}
            <li>{element}</li>
        {/each}
    </ul>
{/if}

