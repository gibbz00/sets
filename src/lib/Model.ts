import { SetMap } from './ADTs/SetMap'
import { ThrowSet } from './ADTs/ThowSet'
import { writable, type Writable, get } from 'svelte/store'
import { KeyAlreadyExistsError } from './ADTs/SetErrors'
import type {
	ExercisePlan,
	Exercises,
	Groups,
	ExerciseProperties,
	WeekNames,
	WorkoutPrograms,
} from './ADTs/Types'

const muscleGroups = [
	'Quad', //0
	'Hamstring', //1
	'Calves', //2
	'Glutes', //3
	'Delts Posterior', //4
	'Delts Medial', //5
	'Delts Anterior', //6
	'Biceps', //7
	'Triceps', //8
	'Lower Back', //9
	'Upper Back', //10
	'Lower Chest', //11
	'Upper Chest', //12
	'Abdominals', //13
]

//TODO: probably load this from a JSON
const seed = {
	exercises: [
		{
			name: 'Bench press',
			groupReferences: [
				{
					groupName: 'Primary',
					tags: ['Upper Chest'],
				},
				{
					groupName: 'Secondary',
					tags: ['Triceps', 'Abdominals'],
				},
			],
		},
		{
			name: 'T-bar row',
			groupReferences: [
				{
					groupName: 'Primary',
					tags: ['Upper Back'],
				},
				{
					groupName: 'Secondary',
					tags: ['Biceps', 'Delts Posterior', 'Abdominals'],
				},
				{
					groupName: 'Phase',
					tags: ['Main'],
				},
			],
		},
		{
			name: 'Deadlift',
			groupReferences: [
				{
					groupName: 'Phase',
					tags: ['Main'],
				},
			],
		},
		{
			name: 'Squat',
			groupReferences: [
				{
					groupName: 'Primary',
					tags: ['Quad'],
				},
			],
		},
		{
			name: 'Overhead press',
			groupReferences: [
				{
					groupName: 'Secondary',
					tags: ['Triceps'],
				},
			],
		},
	],
	weekNames: ['Deload', 'W1', 'W2', 'W3', 'W4'],
	program: [
		{
			name: 'Monday',
			exercisePlans: [
				{
					exerciseName: 'Bench press',
					sets: [1, 2, 3, 3, 4],
				},
				{
					exerciseName: 'T-bar row',
					sets: [1, 1, 3, 2, 4],
				},
			],
		},
		{
			name: 'Tuesday',
			exercisePlans: [
				{
					exerciseName: 'Squat',
					sets: [1, 2, 3, 3, 4],
				},
				{
					exerciseName: 'Deadlift',
					sets: [1, 2, 1, 2, 4],
				},
			],
		},
		{
			name: 'Wednesday',
			exercisePlans: [],
		},
		{
			name: 'Thursday',
			exercisePlans: [],
		},
		{
			name: 'Friday',
			exercisePlans: [],
		},
		{
			name: 'Saturday',
			exercisePlans: [],
		},
		{
			name: 'Sunday',
			exercisePlans: [],
		},
	],
	groups: [
		{
			name: 'Primary',
			tags: muscleGroups,
		},
		{
			name: 'Secondary',
			tags: muscleGroups,
		},
		{
			name: 'Phase',
			tags: ['Warm-up', 'Main'],
		},
		{
			name: 'Direction',
			tags: ['Vertical', 'Horizontal'],
		},
	],
}

export const exercises: Writable<Exercises> = writable(new SetMap())
export const groups: Writable<Groups> = writable(new SetMap())
export const weekNames: Writable<WeekNames> = writable(new ThrowSet())
export const workoutPrograms: Writable<WorkoutPrograms> = writable(new SetMap())
export const selectedDay: Writable<string> = writable(get(workoutPrograms).keys().next().value)
export const selectedGroup: Writable<string | null> = writable(get(groups).keys().next().value)
export const refresh: Writable<Object> = writable(new Object())

function newExercisePlan(exerciseName: string, sets?: number[]): ExercisePlan {
	// SetMap.set() checks for duplicates, no need to loop over them twice
	try {
		exercises.update((setmap) => setmap.set(exerciseName, new SetMap()))
	} catch (error) {
		if (!(error instanceof KeyAlreadyExistsError)) {
			throw new Error('Failed to create Exercise Plan')
		}
	}
	return {
		exerciseName,
		sets: sets ? sets : new Array(get(weekNames).size).fill(0),
	}
}

// Select workoutday
selectedDay.set('Monday')

// Seed groupnames
for (let groupSeed of seed.groups) {
	let tempThrowSet = new ThrowSet<string>()
	for (let tag of groupSeed.tags) {
		tempThrowSet.add(tag)
	}
	groups.update((setmap) => setmap.set(groupSeed.name, tempThrowSet))
}

// Seed exercises
for (let exercise of seed.exercises) {
	let tempProperties: ExerciseProperties = new SetMap()
	for (let exerciseProperty of exercise.groupReferences) {
		let tempTags: ThrowSet<string> = new ThrowSet()
		for (let tag of exerciseProperty.tags) {
			tempTags.add(tag)
		}
		tempProperties.set(exerciseProperty.groupName, tempTags) as ExerciseProperties
	}
	exercises.update((setmap) => setmap.set(exercise.name, tempProperties))
}

// Seed weeknames
for (let weekName of seed.weekNames) {
	weekNames.update((setmap) => setmap.add(weekName))
}

// Seed weekdays
for (let day of seed.program) {
	let tempExercisePlans: ExercisePlan[] = []
	for (let exercisePlan of day.exercisePlans) {
		tempExercisePlans.push(newExercisePlan(exercisePlan.exerciseName, exercisePlan.sets))
	}
	workoutPrograms.update((setmap) => setmap.set(day.name, tempExercisePlans))
}
