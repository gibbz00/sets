type GroupTapMatrix = {
    groupIndex: number, 
    tagIndexes: number[]
}[]

export class Exercise {
    // Should not be able to add duplicates
    readonly groupTagMatrix: GroupTapMatrix = []

    constructor(public name:string, groupTagMatrix?: GroupTapMatrix) {
        if (groupTagMatrix) {
            this.groupTagMatrix = groupTagMatrix
        }
    }
}

export class ExerciseList {
    readonly exercises: Exercise[] = []

    constructor(){
        //Populate list
        //TEMP: maybe do this be reading a json in the future
        const exerciseSeed = [
            {
                name: "Bench press",
                groupTagMatrix: [
                    {
                        groupIndex: 0, 
                        tagIndexes: [9, 7]
                    },
                    {
                        groupIndex: 1, 
                        tagIndexes: [6]
                    },
                ]
            },
            {
                name: "T-bar row",
                groupTagMatrix: [
                    {
                        groupIndex: 0, 
                        tagIndexes: [8, 5]
                    },
                    {
                        groupIndex: 1, 
                        tagIndexes: [7, 4]
                    },
                ]
            },
            {
                name: "Deadlift",
                groupTagMatrix: [
                    {
                        groupIndex: 0, 
                        tagIndexes: [0, 1, 3, 7]
                    },
                    {
                        groupIndex: 1, 
                        tagIndexes: [11]
                    },
                ]
            },
            {
                name: "Squat",
                groupTagMatrix: [
                    {
                        groupIndex: 0, 
                        tagIndexes: [1, 3, 7]
                    },
                    {
                        groupIndex: 1, 
                        tagIndexes: [11]
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
        for (let exercise of exerciseSeed) {
            this.add(exercise)
        }
    }

    public add(exercise: Exercise): void {
       //TODO: type-set error for easier error handling
       if (this.find(exercise.name)) throw new Error("Exercise by the same name aleady exists")
       else {
        this.exercises.push(exercise)
       }
    }

    // Possible optimization would be to make this O(1) with hashmaps
    // Or maybe use the Set ADT
    public find(exerciseName: string): Exercise | false {
        for(let exercise of this.exercises) {
            if (exercise.name == exerciseName) return exercise
        }
        return false
    }
}

