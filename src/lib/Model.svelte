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
        if(desiredName != "") {
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
        }
        resetUI()
    }

    function resetUI(){
        $refresh = new Object()
    }

</script>

<Modal bind:this={modal} visible={false}/>
<Modal bind:this={confirmDeleteModal} visible={false}><button on:click={confirmedGroupDelete}>Delete</button></Modal>