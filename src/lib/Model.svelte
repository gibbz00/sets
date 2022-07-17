<script lang="ts">
    import { exercises, selectedDay, groups, selectedGroup, weekNames, workoutPrograms, refresh } from "$lib/Stores"
    import { ThrowSet } from "$lib/utils/ThowSet";
    import Modal from "$lib/Modal.svelte"
    import { SetMap } from "./utils/SetMap";
    import type { ExercisePlan } from "./utils/Types";

    let modal: Modal
    let confirmDeleteModal: Modal
    //TODO: fix this awful API
    let deleteProcess: Generator


    /*
        GROUPS
    */
    export function createGroup(groupName: string){
        if($groups.has(groupName))  {
            modal.show(`${groupName} group already exists!`)
        }
        else {
            $groups = $groups.set(groupName, new ThrowSet())
            $selectedGroup = groupName
            resetUI()
        }
    }

    export function deleteGroup(groupName: string) {
        deleteProcess = deleteGroupGenerator()
        confirmDeleteModal.show(`Delete ${groupName} group?`)

        function* deleteGroupGenerator() {
            yield confirmedGroupDelete() 
        }

        function confirmedGroupDelete() {
            confirmDeleteModal.hide()
            $groups = $groups.deleteThisReturn(groupName)
            // Must also delete the "references" in $exercises.
            for (let properties of $exercises.values()) {
                if (properties.has(groupName)) properties.delete(groupName)
            }

            // select next group
            if ($groups.size == 0) $selectedGroup = null
            else {
                //TODO: improve next group to be selected logic
                    // selects the nearest neighbor group, if there are one on each side: select the last
                $selectedGroup = $groups.keys().next().value
            }
        }
    }
    


    /*
        TAG
    */

    //TODO: Very similar to createGroup, could probably be refactored
    export function createTag(tagName: string) {
        if ($selectedGroup != null) {
            if($groups.getDefined($selectedGroup).has(tagName)) {
                modal.show(`${tagName} tag already exists!`)
            }
            else {
                $groups.getDefined($selectedGroup).add(tagName) 
                //HACK: to force reactivity
                $groups = $groups
                resetUI()
            }
        }
    }

    export function deleteTag(tagName: string) {
        deleteProcess = deleteTagGenerator()
        confirmDeleteModal.show(`Delete ${tagName} tag?`)

        function* deleteTagGenerator(){
            yield confirmedTagDelete()
        }

        function confirmedTagDelete(){
            confirmDeleteModal.hide()
            // remove from $groups
            $groups.getDefined($selectedGroup!).delete(tagName)
            //HACK: reactivity trigger
            $groups = $groups

            // remove $exercises 
            for (let properties of $exercises.values()) {
               for (let tags of properties.values()) {
                    if (tags.has(tagName)) tags.delete(tagName)
                    // no reactivity needs to currently be triggered since exercise tags are shown on a different route
               }
            }
        }
    }


    /*
        WEEK
    */
    export function createWeek(weekName: string){
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

    /*
        EXERCISE PLAN
    */
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


    /*
        EXERCISE TAG
    */
    export function createExerciseTag(desiredName :string, groupName: string, exerciseName: string) {
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

    export function deleteExerciseTag(exerciseName: string, groupName: string, tagName: string) {
        deleteProcess = deleteExerciseTagGenerator()
        confirmDeleteModal.show(`Delete ${tagName} tag of ${groupName} in ${exerciseName}?`)

        function* deleteExerciseTagGenerator(){
            yield confirmedExerciseTagDelete()
        }

        function confirmedExerciseTagDelete(){
            confirmDeleteModal.hide()
            // remove tag from $exercises
            $exercises.getDefined(exerciseName).getDefined(groupName).delete(tagName)
            $exercises = $exercises
        }
    }

    function resetUI(){
        $refresh = new Object()
    }

</script>

<Modal bind:this={modal} visible={false}/>
<Modal bind:this={confirmDeleteModal} visible={false}><button on:click={() => {deleteProcess.next()}}>Delete</button></Modal>