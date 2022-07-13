import { SetMap } from "./utils/SetMap"
import { ThrowSet } from "./utils/ThowSet"
import { writable, type Writable, get} from "svelte/store"
import { KeyAlreadyExistsError } from "./utils/SetErrors"
import type { ExercisePlan, GroupReference } from "./utils/Types"


const muscleGroups = [
    "Quad", //0
    "Hamstring", //1
    "Calves", //2
    "Glutes", //3
    "Delts Posterior", //4
    "Delts Medial", //5
    "Delts Anterior", //6
    "Biceps", //7
    "Triceps", //8
    "Lower Back", //9
    "Upper Back", //10
    "Lower Chest", //11
    "Upper Chest", //12
    "Abdominals" //13
]

//TODO: probably load this from a JSON
const seed = {
    exercises: [
        {
            name: "Bench press",
            groupReferences: [
                { 
                    group: "Primary",
                    tags: ["Upper Chest"]
                },
                {
                    group: "Secondary",
                    tags: ["Triceps"]
                }
            ]
        },
        {
            name: "T-bar row",
            groupReferences: [
                { 
                    group: "Primary",
                    tags: ["Upper Back"]
                },
                {
                    group: "Secondary",
                    tags: ["Biceps", "Delts Posterior"]
                },
                {
                    group: "Phase",
                    tags: ["Main"]
                }
            ]
        },
        {
            name: "Deadlift",
            groupReferences: [{
                    group: "Phase",
                    tags: ["Main"]
            }]
        },
        {
            name: "Squat",
            groupReferences: [{
                    group: "Primary",
                    tags: ["Quad"]
            }]
        },
        {
            name: "Overhead press",
            groupReferences: [{
                    group: "Secondary",
                    tags: ["Triceps"]
            }]
        }
    ],
    weekNames: ["Deload", "W1", "W2", "W3", "W4"],
    program: [
        {
            name: "Monday",
            exercisePlans: [
                {
                    exerciseName: "Bench press",
                    sets: [2,3,3,4]
                },
                {
                    exerciseName: "T-bar row",
                    sets: [1,3,2,4]
                }
            ]
        },
        {
            name: "Tuesday",
            exercisePlans: [
                {
                    exerciseName: "Squat",
                    sets: [2,3,3,4]
                },
                {
                    exerciseName: "Deadlift",
                    sets: [1,1,2,4]
                }
            ]
        }
    ],
    groups: [
        {
            name: "Primary",
            tags: muscleGroups
        },
        {
            name: "Secondary",
            tags: muscleGroups
        },
        {
            name: "Phase",
            tags: ["Warm-up", "Main"]
        },
        {
            name: "Direction",
            tags: ["Vertical", "Horizontal"]
        },
    ]
}

export const exercises = writable(new SetMap<string, GroupReference[]>())
export const groups = writable(new SetMap<string, ThrowSet<string>>())
export const weekNames = writable(new ThrowSet<string>())
export const workoutProgram = writable(new SetMap<string, ExercisePlan[]>())


function newExercisePlan(exerciseName: string, sets?: number[]): ExercisePlan {
    // SetMap.set() checks for duplicates, no need to loop over them twice
    try {
        exercises.update( setmap => setmap.set(exerciseName, []))
        return {
            exercise: get(exercises).getEntry(exerciseName)!,
            sets: (sets? sets : new Array(get(weekNames).size))
        }
    }
    catch (error) {
        if (error instanceof KeyAlreadyExistsError) return {
            exercise: get(exercises).getEntry(exerciseName)!,
            sets: (sets? sets : new Array(get(weekNames).size))
        }
        throw new Error("Failed to create Exercise Plan")
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

//TODO: make exercises reference tags by refernce
// Seed exerciseSetMap
for (let exercise of seed.exercises) {
    let tempGroupReferences: GroupReference[] = []
    for (let groupReference of  exercise.groupReferences) {
        let tempGroupReference: GroupReference  = {
            group: get(groups).getEntry(groupReference.group),
            // should be refernces to the groups tags
            tags: new ThrowSet<string>()
        }

        for (let tag of (get(groups).get(groupReference.group) as ThrowSet<string>)){
            if (groupReference.tags.includes(tag)){
                tempGroupReference.tags.add(tag)
            }
        }
        tempGroupReferences.push(tempGroupReference)
    }
    exercises.update((setmap) => setmap.set(exercise.name, tempGroupReferences))
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
    workoutProgram.update((setmap) => setmap.set(day.name, tempExercisePlans))
}