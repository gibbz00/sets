import { ExerciseList } from "./ExerciseList";

//Populate list
//TEMP: maybe do this be reading a json in the future
const exerciseSeed = [
    {
        name: "Bench press",
        groupTagMatrix: [
            {
                groupIndex: 0, 
                tagIndexes: [11, 8]
            },
            {
                groupIndex: 1, 
                tagIndexes: [6]
            },
            {
                groupIndex: 2, 
                tagIndexes: [1]
            },
            {
                groupIndex: 3, 
                tagIndexes: [0]
            },
        ]
    },
    {
        name: "T-bar row",
        groupTagMatrix: [
            {
                groupIndex: 0, 
                tagIndexes: [10, 7]
            },
            {
                groupIndex: 1, 
                tagIndexes: [11, 4]
            },
            {
                groupIndex: 2, 
                tagIndexes: [1]
            },
            {
                groupIndex: 3, 
                tagIndexes: [0]
            },
        ]
    },
    {
        name: "Deadlift",
        groupTagMatrix: [
            {
                groupIndex: 0, 
                tagIndexes: [0, 1, 3, 9]
            },
            {
                groupIndex: 1, 
                tagIndexes: [13]
            },
        ]
    },
    {
        name: "Squat",
        groupTagMatrix: [
            {
                groupIndex: 0, 
                tagIndexes: [1, 3, 9]
            },
            {
                groupIndex: 1, 
                tagIndexes: [0, 13]
            },
        ]
    },
    {
        name: "Overhead press",
        groupTagMatrix: [
            {
                groupIndex: 0, 
                tagIndexes: [5, 6]
            },
            {
                groupIndex: 1, 
                tagIndexes: [7]
            },
        ]
    }
]

export const seededExerciseList = ((): ExerciseList => {
    let seededExerciseList = new ExerciseList()
    for (let exercise of exerciseSeed) {
        seededExerciseList.add(exercise)
    }
    return seededExerciseList
})()