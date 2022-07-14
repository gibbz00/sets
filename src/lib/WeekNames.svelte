<script lang="ts">
    import { weekNames } from "./SeededStores";
</script>

{#each Array.from($weekNames.values()) as weekName}
<div>{weekName}</div>
{/each}