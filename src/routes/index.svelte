<svelte:head>
    <!-- HACK -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/themes/light.css" />
    <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.77/dist/shoelace.js"></script>
</svelte:head>

<script>
    import AutoComplete from "$lib/AutoComplete.svelte"

    let selectedDay = 0
    let weekdays=[
        {
            index: 0, 
            name: "Monday",
            exercises: ["Bench press", "T-bar row"]
        },
        {
            index: 1,
            name: "Tuesday",
            exercises: ["Squats"]
        },
        {
            index: 2,
            name: "Wednesday",
            exercises: ["Barbell overhead press"]
        },
        {
            index: 3,
            name: "Thursday",
            exercises: ["Barbell overhead press"]
        },
        {
            index: 4,
            name: "Friday",
            exercises: ["Barbell overhead press"]
        },
        {
            index: 5,
            name: "Saturday",
            exercises: ["Barbell overhead press"]
        },
        {
            index: 6,
            name: "Sunday",
            exercises: ["Barbell overhead press"]
        }
    ]

    let exercises=[
        "Bench press",
        "Dips",
        "Deadlift",
        "Squat"
    ]
</script>

<select bind:value={selectedDay}>
    {#each weekdays as weekday }
        <option value={weekday.index}>{weekday.name}</option>
    {/each}
</select>

{#each weekdays[selectedDay].exercises as exercise}
    <p>{exercise}</p>
{/each}

<AutoComplete data={exercises} placeholder="Add exercise"/>