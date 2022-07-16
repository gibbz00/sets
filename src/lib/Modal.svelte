<script lang="ts">
    let message: string = ""
    export let visible: boolean = true

    export function show(incomingMessage: string){
        message = incomingMessage
        visible = true
    }

    export function hide() {
        visible = false
    }

    function handleKey(event: KeyboardEvent) {
        if (visible && event.key == "Escape") hide()
    }
</script>

<svelte:window on:keydown={handleKey}/>

{#if visible}
    <div on:click={hide}>
        <div on:click|stopPropagation={undefined}>
            {message}
            <slot></slot>
            <button on:click={hide}>Close</button>
        </div>
    </div>
{/if}

<style>
    div {
        background-color: rgba(0, 0, 0, 0.6);
        position: fixed;
        top: 0%;
        bottom: 0%;
        left: 0%;
        right: 0%;
        z-index: 1;
    }

    div div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: auto;
        background-color: white;
        width: 20rem;
        height: 15rem;
        z-index: 2;
    }

</style>