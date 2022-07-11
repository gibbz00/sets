<!-- TODO: title automatically added all pages, apart from those where something else is appropriate -->
<svelte:head>
    <title>Sets</title>
</svelte:head>

<script>
    import { Program } from "$lib/Program"
    let program = new Program()

    /* 
        Non-demo verion:
        import { GroupList } from "$lib/GroupList"
        let groupList = new GroupList()
        Replaces:
    */
    import { seededGroupList } from "$lib/GroupListSeed"
    let groupList = seededGroupList

    let selectedDay = 0
</script>

<select bind:value={selectedDay}>
    {#each program.workoutDays as day, index}
        <option value={index}>{day.name}</option>
    {/each}
</select>

<a href="/analysis">Set analysis</a>

<hr>

<div class="grid" style:--group-columns={groupList.groups.length}>
    <div class="weeks">
        {#each program.weekNames as weekName}
            {weekName}
        {/each}
    </div>

    <!-- group names -->
    {#each groupList.groups as group}
        <div class=group-name>{group.name}</div>
    {/each}

    <!-- Render exercise names, their sets, and their tags for the selected day -->
    {#each program.workoutDays[selectedDay].exercisePlans as exercisePlan}
        <div class="exercise-names">
            {exercisePlan.exercise.name}
        </div>

        <!-- sets -->
        <div class="sets">
            {#each exercisePlan.sets as set}
                {set}
            {/each}
        </div>

        <!-- groups -->
        {#each exercisePlan.exercise.groupTagMatrix as group}
            <!-- place inside right column -->
            <div style:grid-column-start={3+group.groupIndex}>
                <!-- loop over each tag and decorate with right color name -->
                {#each group.tagIndexes as tagIndex }
                    <span>{groupList.groups[group.groupIndex].tags[tagIndex]}</span>
                {/each}
            </div>
        {/each}
   {/each}

</div>


<style>
    .grid {
        display: grid;
        grid-template-columns: calc(2 + var(--group-columns));
        grid-template-columns: repeat(calc(2 + var(--group-columns)), 1fr);
        grid-auto-rows: 50px;
    }

    .weeks {
        grid-column-start: 2;
    }

    /* TODO: required if the tags are loaded dynamically?  */
    .exercise-names {
        grid-column-start: 1;
    }
</style>

<!-- <AutoComplete data={exerciseList.exercises.map(exercise => exercise.name)} placeholder="Add exercise"/> -->