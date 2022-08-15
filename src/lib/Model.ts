import { SetMap } from './ADTs/SetMap'
import { ThrowSet } from './ADTs/ThowSet'
import { writable, type Writable, get } from 'svelte/store'
import { KeyAlreadyExistsError } from './ADTs/SetErrors'

export type WeekNames = ThrowSet<string>
export type ExerciseProperties = SetMap<string, ThrowSet<string>>
export type Exercises = SetMap<string, ExerciseProperties>
export type Groups = SetMap<string, ThrowSet<string>>
export type ExercisePlan = {
	exerciseName: string
	sets: number[]
}
type WorkoutProgramInfo = {
	description: string
	exercises: ExercisePlan[]
}
export type WorkoutPrograms = SetMap<string, WorkoutProgramInfo>

export const exercises: Writable<Exercises> = writable(new SetMap())
export const groups: Writable<Groups> = writable(new SetMap())
export const weekNames: Writable<WeekNames> = writable(new ThrowSet())
export const workoutPrograms: Writable<WorkoutPrograms> = writable(new SetMap())
export const selectedDay: Writable<string> = writable()
export const selectedGroup: Writable<string | null> = writable()

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
			info: {
				description: 'Strength - Chest and Back',
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
		},
		{
			name: 'Tuesday',
			info: {
				description: 'Strength - Legs',
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
		},
		{
			name: 'Wednesday',
			info: {
				description: '',
				exercisePlans: [],
			},
		},
		{
			name: 'Thursday',
			info: {
				description: '',
				exercisePlans: [],
			},
		},
		{
			name: 'Friday',
			info: {
				description: '',
				exercisePlans: [],
			},
		},
		{
			name: 'Saturday',
			info: {
				description: '',
				exercisePlans: [],
			},
		},
		{
			name: 'Sunday',
			info: {
				description: '',
				exercisePlans: [],
			},
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
	let info: { description: string; exercises: ExercisePlan[] } = {
		description: day.info?.description,
		exercises: [],
	}
	for (let exercisePlan of day.info?.exercisePlans) {
		info.exercises.push(newExercisePlan(exercisePlan.exerciseName, exercisePlan.sets))
	}
	workoutPrograms.update((setmap) => setmap.set(day.name, info))
}

// Select initial weekday and week
selectedDay.set('Monday')
selectedGroup.set('Primary')
