
export class Exercise {
    constructor(public name:string) {}
}

export class ExerciseList {
    readonly exercises: Exercise[] = []

    constructor(){
        //Populate list
        //TEMP: maybe do this be reading a json in the future
        const exerciseNames = [
            "Deadlift",
            "Bench press",
            "T-bar row",
            "Squat",
            "Overhead press"
        ]
        for (let exerciseName of exerciseNames) {
            this.add(new Exercise(exerciseName))
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

