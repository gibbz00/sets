<svelte:head>
    <!-- HACK -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/themes/light.css" />
    <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/shoelace.js"></script>
</svelte:head>

<script>
    import AutoComplete from "$lib/AutoComplete.svelte"

    let weekdays=[
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]

    let exercises=[
        "Bench press",
        "Dips",
        "Deadlift",
        "Squat"
    ]
</script>

<sl-select>
    {#each weekdays as weekday }
        <sl-menu-item value={weekday}>{weekday}</sl-menu-item>
    {/each}
</sl-select>

<AutoComplete data={exercises} placeholder="Add exercise"/>