<script lang="ts">
    import { exercises, selectedDay, groups, selectedGroup, weekNames, workoutPrograms, refresh } from "$lib/Stores"
    import { ThrowSet } from "$lib/utils/ThowSet";
    import Modal from "$lib/Modal.svelte"
    import { SetMap } from "./utils/SetMap";
    import type { ExercisePlan } from "./utils/Types";

    let modal: Modal
    // TODO: improve this god-awful API
    let confirmDeleteModal: Modal
    let toDelete: string

    export function createGroup(groupName: string){
        if($groups.has(groupName))  {
            modal.show(`${groupName} group already exists!`)
        }
        else {
            $groups = $groups.set(groupName, new ThrowSet())
            $selectedGroup = groupName
        }
    }

    export function deleteGroup(groupName: string) {
        toDelete = groupName
        confirmDeleteModal.show(`Delete ${groupName} group?`)
    }

    export function confirmedGroupDelete() {
        confirmDeleteModal.hide()
        $groups = $groups.deleteThisReturn(toDelete)
        // Must also delete the "references" in $exercises.
        for (let properties of $exercises.values()) {
            if (properties.has(toDelete)) properties.delete(toDelete)
        }

        // select next group
        if ($groups.size == 0) $selectedGroup = null
        else {
            //TODO: improve next group to be selected logic
                // selects the nearest neighbor group, if there are one on each side: select the last
            $selectedGroup = $groups.keys().next().value
        }
    }

    export function addWeek(weekName: string){
        // Check that week names does not already exist
        if ($weekNames.has(weekName)) {
                modal.show(`${weekName} already exists!`)
        }
        else {
            $weekNames = $weekNames.add(weekName)
            // numbers of sets in exercise plans must also be updated
            for (let [weekName, exercisePlans] of  $workoutPrograms.entries()){
                for (let index = 0; index < exercisePlans.length; index++) {
                    exercisePlans[index].sets.push(0)
                }
                $workoutPrograms = $workoutPrograms.update(weekName, exercisePlans)
            }
            resetUI()
        }
    }

    export function createExercisePlan(desiredName: string){
        if (!$exercises.has(desiredName)) {
            $exercises.set(desiredName, new SetMap())
        }
        const newExercisePlan: ExercisePlan = {
            exerciseName: desiredName,
            sets: new Array($weekNames.size).fill(0)
        }
        workoutPrograms.update(setmap => { 
            setmap.get($selectedDay)!.push(newExercisePlan)
            return setmap
        })
        resetUI()
    }

        export function addExerciseTag(desiredName :string, groupName: string, exerciseName: string) {
            // Check that tag is not present exercise property 
            if($exercises.get(exerciseName)?.get(groupName)?.has(desiredName)){
                // BUG: Inputs that are only shown during hover are not disabled when modal is shown
                    // Possible solution would be to either hide the clickable tooltip, or move mouse cursor to modal
                modal.show(`The tag ${desiredName} already exists in ${groupName}!`)
                return
            }

            // Check that tag does not aleady exists in group. If so; add it to the groups registry
            if (!$groups.get(groupName)?.has(desiredName)) {
                $groups.get(groupName)?.add(desiredName)
            }

            // Link tag to exercise
            exercises.update(setmap => {
                let exerciseProperties = setmap.getDefined(exerciseName)
                // check if group exists
                // if not create groupName entry
                if(!exerciseProperties.has(groupName)) {
                    exerciseProperties.set(groupName, new ThrowSet())
                }
                exerciseProperties.getDefined(groupName).add(desiredName)
                return setmap.update(exerciseName, exerciseProperties)
            })
        resetUI()
    }

    function resetUI(){
        $refresh = new Object()
    }

</script>

<Modal bind:this={modal} visible={false}/>
<Modal bind:this={confirmDeleteModal} visible={false}><button on:click={confirmedGroupDelete}>Delete</button></Modal>