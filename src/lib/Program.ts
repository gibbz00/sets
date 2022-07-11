import type { Exercise } from "./ExerciseList"
import { ExerciseList } from "./ExerciseList"
import { GroupList } from "./GroupList"

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
    readonly exerciseList = new ExerciseList()
    readonly groupList =  new GroupList()
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