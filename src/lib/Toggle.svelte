<script lang="ts">
    let hidden: boolean = true
</script>

{#if hidden}
    <div on:click={() => hidden = !hidden}>
        <slot name="first"></slot>
    </div>
{:else}
    <slot name="second"></slot>
{/if}