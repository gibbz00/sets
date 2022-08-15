<!-- 
	TODO: remove table preparation
 -->
<script lang="ts">
	import '@carbon/styles/css/styles.css'
	import '@carbon/charts/styles.css'
	import { onMount } from 'svelte'
	import type { RadarChartOptions } from '@carbon/charts/interfaces/charts'
	import { groups, weekNames, exercises, workoutPrograms } from '$lib/Model'
	import { SetMap } from '$lib/ADTs/SetMap'

	let selectedGroup = 'Primary'
	let tagSets = (() => {
		let tempTagSets: SetMap<string, number[]> = new SetMap()
		if (selectedGroup != null) {
			for (let tagName of $groups.getDefined(selectedGroup).values()) {
				tempTagSets.set(tagName, new Array($weekNames.size).fill(0))
			}
			for (let exercisesPlans of $workoutPrograms.values()) {
				for (let exercisePlan of exercisesPlans) {
					let exerciseGroups = $exercises.getDefined(exercisePlan.exerciseName)
					if (exerciseGroups.has(selectedGroup)) {
						for (let exerciseTag of exerciseGroups.getDefined(selectedGroup)) {
							tempTagSets.update(
								exerciseTag,
								tempTagSets
									.getDefined(exerciseTag)
									.map(
										(setCount, weekIndex) =>
											setCount + exercisePlan.sets[weekIndex]
									)
							)
						}
					}
				}
			}
		}
		return tempTagSets
	})()
	console.table(tagSets)

	type DataElement = { tag: string; group: string; setCount: number }
	let mockup: DataElement[] = []
	for (let [tag, sets] of tagSets) {
		for (let i = 0; i < sets.length; i++) {
			mockup.push({
				tag,
				group: `W${i}`,
				setCount: sets[i],
			})
		}
	}

	let chart

	onMount(async () => {
		const charts = await import('@carbon/charts-svelte')
		chart = charts.RadarChart
		console.table(tagSets)
	})

	// radar dense
	const radarDenseDataTmp = [
		{ tag: 'Biceps', group: 'W1', setCount: 1 },
		{ tag: 'Triceps', group: 'W1', setCount: 1 },
		{ tag: 'Back', group: 'W1', setCount: 3 },
		{ tag: 'Upper', group: 'W2', setCount: 3 },
		{ tag: 'Abs', group: 'W2', setCount: 3 },
	]
	const radarDenseOptionsTmp: RadarChartOptions = {
		title: 'Placeholder Title',
		radar: {
			axes: {
				angle: 'tag',
				value: 'setCount',
			},
		},
		height: '50rem',
		width: '50rem',
	}
</script>

<svelte:component this={chart} data={mockup} options={radarDenseOptionsTmp} />
