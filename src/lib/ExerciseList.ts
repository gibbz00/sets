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

