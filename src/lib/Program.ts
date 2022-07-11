import type { Exercise } from "./ExerciseList"
import { ExerciseList } from "./ExerciseList"
// REMOVE: for non-demo
import { seededExerciseList } from "./ExercisListSeed"


type workoutDay = {
    name: string,
    exercisePlans: 
        {
            exercise: Exercise,
            sets: number[]
        }[]
}


//Build this is the future by reading a JSON or something
export class Program { 
    // REPLACE: for non-demo
    // readonly exerciseList = new ExerciseList()
    // REMOVE: for non-demo
    readonly exerciseList = seededExerciseList
    //TODO: prevent duplicate nameing (using sets?)
    //TODO: add Weeknames CRUD
    readonly weekNames = ["Deload", "W1", "W2", "W3", "W4"]

    workoutDays = [
        {
            name: "Monday",
            exercisePlans:  [
                {
                    exercise: this.exerciseList.find("Bench press") as Exercise, 
                    sets: [2,3,3,4]
                },
                {
                    exercise: this.exerciseList.find("T-bar row") as Exercise, 
                    sets: [1,3,2,4]
                }
            ]
        },
        {
            name: "Tuesday",
            exercisePlans:  [
                {
                    exercise: this.exerciseList.find("Squat") as Exercise, 
                    sets: [2,3,3,4]
                },
                {
                    exercise: this.exerciseList.find("Deadlift") as Exercise, 
                    sets: [1,1,2,4]
                }
            ]
        },
    ]
}