<script lang="ts">
    import { weekNames } from "./Stores";
    import Model from "./Model.svelte";
    import HoverChange from "./HoverChange.svelte";

    let model: Model
</script>

<Model bind:this={model} />

{#each Array.from($weekNames.values()) as weekName, index}
    <HoverChange 
        updatePlaceholder="New week name" 
        on:update={(event) => model.upddateWeek(weekName, event.detail)}
        on:delete={() => model.deleteWeek(weekName, index)}
    >
        <div class="w-full">
            {weekName}
        </div>
    </HoverChange>
{/each}