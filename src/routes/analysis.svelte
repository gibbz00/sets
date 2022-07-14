<!-- TODO: title automatically added all pages, apart from those where something else is appropriate -->
<svelte:head>
    <title>Sets</title>
</svelte:head>

<script lang="ts">
    import  WeekNames from "$lib/WeekNames.svelte"
    import { groups } from "$lib/SeededStores"

    //TODO: This logic is quite similar to that of select weekdays in index, check if it can be modularised.
    let selectedGroup: string = $groups.keys().next().value
</script>


<WeekNames />