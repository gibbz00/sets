<script lang="ts">
	import {
		exercises,
		selectedDay,
		groups,
		selectedGroup,
		weekNames,
		workoutPrograms,
		type ExercisePlan,
	} from '$lib/Model'
	import { ThrowSet } from '$lib/ADTs/ThowSet'
	import Modal from '$lib/Modal.svelte'
	import { SetMap } from './ADTs/SetMap'

	let modal: Modal
	let confirmDeleteModal: Modal
	//TODO: fix this awful API
	let deleteProcess: Generator

	/*
        EXERCISE
    */
		export function createExercise(exerciseName: string) {
			if ($exercises.has(exerciseName)) {
				modal.show(`<b>${exerciseName}</b> already exists!`)
			} else {
				$exercises.set(exerciseName, new SetMap())
				$exercises = $exercises
			}
		}

	/*
        EXERCISE TAG
    */
		export function createExerciseTag(
			desiredName: string,
			groupName: string,
			exerciseName: string
		) {
			// check the exercise has group entry property
			// if not, create group reference
			if (!$exercises.getDefined(exerciseName).has(groupName)) {
				$exercises.getDefined(exerciseName).set(groupName, new ThrowSet())
			}
			// Check that tag is not already present in exercise property for the given group
			else if ($exercises.getDefined(exerciseName).getDefined(groupName).has(desiredName)) {
				// BUG: Inputs that are only shown during hover are not disabled when modal is shown
				// Possible solution would be to either "manually" hide the clickable tooltip, or move mouse cursor to modal
				modal.show(`<b>${desiredName}</b> already added to <b>${groupName}</b>!`)
				return
			}

			// Makes sure that tag exists in $groups registry
			if (!$groups.getDefined(groupName).has(desiredName)) {
				$groups.getDefined(groupName).add(desiredName)
			}

			// Finally, link tag to exercise
			$exercises.getDefined(exerciseName).getDefined(groupName).add(desiredName)
			$exercises = $exercises
		}

		//Accidentaly deleted exercise tags can easily be added again, confirmation modal feels a bit overkill.
		export function deleteExerciseTag(exerciseName: string, groupName: string, tagName: string) {
			// remove tag from $exercises
			$exercises.getDefined(exerciseName).getDefined(groupName).delete(tagName)
			$exercises = $exercises
		}

	/*
        GROUPS
    */
		export function createGroup(groupName: string) {
			if ($groups.has(groupName)) {
				modal.show(`<b>${groupName}</b> already exists!`)
			} else {
				$groups = $groups.set(groupName, new ThrowSet())
				$selectedGroup = groupName
			}
		}

		export function updateGroup(oldGroupName: string, newGroupName: string) {
			$groups = $groups.updateKeyPreserveOrder(oldGroupName, newGroupName)
			if (oldGroupName == $selectedGroup) $selectedGroup = newGroupName
		}

		export function deleteGroup(groupName: string) {
			deleteProcess = deleteGroupGenerator()
			confirmDeleteModal.show(
				`Delete <b>${groupName}</b>? All of the associated tags will also be removed.`
			)

			function* deleteGroupGenerator() {
				yield confirmedGroupDelete()
			}

			function confirmedGroupDelete() {
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
				if ($groups.getDefined($selectedGroup).has(tagName)) {
					modal.show(`<b>${tagName}</b> already exists!`)
				} else {
					$groups.getDefined($selectedGroup).add(tagName)
					//HACK: to force reactivity
					$groups = $groups
				}
			}
		}

		export function updateTag(groupName: string, oldTagName: string, newTagName: string) {
			//Make sure that the new tag name is not present in group
			if ($groups.getDefined(groupName).has(newTagName)) {
				modal.show(`<b>${newTagName}</b> tag already added to <b>${groupName}</b>!`)
			} else {
				$groups.getDefined(groupName).update(oldTagName, newTagName)
				$groups = $groups

				// And in each exercise
				for (let [exerciseName, exerciseProperties] of $exercises.entries()) {
					// Update only for the correct group, and if so a group that has the tag to be updated
					// Shortcuts first statement if groupname does not exist on exercise,
					// so need to worry for getDefined to throw noKeyError
					if (
						exerciseProperties.has(groupName) &&
						exerciseProperties.getDefined(groupName).has(oldTagName)
					) {
						$exercises
							.getDefined(exerciseName)
							.getDefined(groupName)
							.update(oldTagName, newTagName)
					}
				}
				$exercises = $exercises
			}
		}

		export function deleteTag(tagName: string) {
			deleteProcess = deleteTagGenerator()
			confirmDeleteModal.show(
				`Delete <b>${tagName}</b>? Tag will be removed from all associated exercises.`
			)

			function* deleteTagGenerator() {
				yield confirmedTagDelete()
			}

			function confirmedTagDelete() {
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
		export function createWeek(weekName: string) {
			// Check that week names does not already exist
			if ($weekNames.has(weekName)) {
				modal.show(`<b>${weekName}</b> already exists!`)
			} else {
				$weekNames = $weekNames.add(weekName)
				// numbers of sets in exercise plans must also be updated
				for (let [weekDay, workoutInfo] of $workoutPrograms.entries()) {
					for (let index = 0; index < workoutInfo.exercises.length; index++) {
						workoutInfo.exercises[index].sets.push(0)
					}
					$workoutPrograms = $workoutPrograms.update(weekDay, workoutInfo)
				}
			}
		}

		export function updateWeek(oldWeekName: string, newWeekName: string) {
			$weekNames.update(oldWeekName, newWeekName)
			$weekNames = $weekNames
		}

		export function deleteWeek(weekName: string, index: number) {
			deleteProcess = deleteWeekGenerator()
			confirmDeleteModal.show(
				`Are you sure you want to delete the entire <b>${weekName}</b> set plan?`
			)

			function* deleteWeekGenerator() {
				yield confirmedWeekDelete()
			}

			function confirmedWeekDelete() {
				$weekNames.delete(weekName)
				$weekNames = $weekNames
				// delete sets
				for (let [, workoutInfo] of $workoutPrograms.entries()) {
					for (let exercisePlan of workoutInfo.exercises) {
						exercisePlan.sets.splice(index, 1)
					}
				}
				$workoutPrograms = $workoutPrograms
			}
		}

	/*
        EXERCISE PLAN
    */
		export function createExercisePlan(desiredName: string) {
			if (!$exercises.has(desiredName)) {
				$exercises.set(desiredName, new SetMap())
				$exercises = $exercises
			}
			const newExercisePlan: ExercisePlan = {
				exerciseName: desiredName,
				sets: new Array($weekNames.size).fill(0),
			}
			workoutPrograms.update((setmap) => {
				setmap.getDefined($selectedDay).exercises.push(newExercisePlan)
				return setmap
			})
		}

		// Change an exercise in an exercise plan, number of sets aren't changed
		export function updatePlanExercise(newExercisePlanName: string, index: number) {
			// if exercise does not exist: create new exercise in $exercises
			if (!$exercises.has(newExercisePlanName)) {
				createExercise(newExercisePlanName)
			}

			$workoutPrograms.getDefined($selectedDay).exercises[index].exerciseName =
				newExercisePlanName
			$workoutPrograms = $workoutPrograms
			// has to also be updated,
			$exercises = $exercises
		}

		export function deleteExercisePlan(selectedDay: string, exerciseName: string, index: number) {
			deleteProcess = deleteExercisePlanGenerator()
			confirmDeleteModal.show(`Remove <b>${exerciseName}</b> from <b>${selectedDay}</b>?`)

			function* deleteExercisePlanGenerator() {
				yield confirmedExercisePlanDelete()
			}

			function confirmedExercisePlanDelete() {
				$workoutPrograms.getDefined(selectedDay).exercises.splice(index, 1)
				$workoutPrograms = $workoutPrograms
			}
		}

</script>

<Modal bind:this={modal} />
<Modal
	bind:this={confirmDeleteModal}
	toDelete
	on:delete={() => {
		deleteProcess.next()
	}}
/>
