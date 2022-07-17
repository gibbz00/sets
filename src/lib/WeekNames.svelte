<script lang="ts">
    import { weekNames } from "./Stores";
    import HoverDelete from "./HoverDelete.svelte";
    import Model from "./Model.svelte";

    let model: Model
</script>

<Model bind:this={model} />

{#each Array.from($weekNames.values()) as weekName, index}
    <HoverDelete on:remove={() => model.deleteWeek(weekName, index)}>
        <div>{weekName}</div>
    </HoverDelete>
{/each}