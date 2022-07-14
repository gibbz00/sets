<script lang="ts">
    let hidden: boolean = true
</script>

{#if hidden}
    <span on:click={() => hidden = !hidden}>
        <slot name="first"></slot>
    </span>
{:else}
    <slot name="second"></slot>
{/if}