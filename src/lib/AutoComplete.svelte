<script lang="ts">
    export let data: string[];
    export let placeholder: string | undefined

    let input = ''
    let remaining: typeof data = [];


    function filterData(event: InputEvent){
        input = (event as any).target.value 

        //TEST: input is nill and all data is shown
        if (input.length == 0){
            remaining = data;
        }
        //compares each letter
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

</script>

<!-- bind:input not used since eventlistener is fired first anyway, creates a bug in all the data is shown before any input has been made -->
<sl-input type="text" autocomplete="off" {placeholder} on:input={(event) => filterData(event)} value={input}></sl-input>
{#if remaining.length > 0}
    <sl-menu>
        {#each remaining as element}
            <sl-menu-item>{element}</sl-menu-item>
        {/each}
    </sl-menu>
{/if}

