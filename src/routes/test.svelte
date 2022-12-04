<script lang="ts">
    import PopMenu from "../lib/PopMenu.svelte"
    import ExerciseInfo from '$lib/ExerciseInfo.svelte'
    import SelectElementReplacement from "../lib/SelectElementReplacement.svelte"
    import { selectedDay, workoutPrograms} from '$lib/Model'
    import InteractiveList from "../lib/InteractiveList.svelte"
	import Select from "../lib/Select.svelte"
</script>

<div class="max-w-max">
    <PopMenu
        fadeTransition
        iconType="arrowRight"
        iconClass={{
            opened: 'rotate-180',
        }}
    >
        <div slot="placeholderContent" class="max-w-[22rem] ml-3 my-1 truncate">
            Bench
        </div>
        <ExerciseInfo
            slot="popMenuWindow"
            exerciseName={'Bench press'}
            exercisePlanIndex={0}
        />
    </PopMenu>
</div>

<hr>

<Select
    placeholder={$selectedDay}
    options={[...$workoutPrograms.keys()]}
    on:selected={(event) => {
        $selectedDay = event.detail.selected
    }}
>
</Select>

<hr>

<SelectElementReplacement 
    placeholderText={$selectedDay}
    optionStringItems={[...$workoutPrograms.keys()]}
    on:selected={(event) => {
        $selectedDay = event.detail.selected
    }}
/>