import type { SetMap } from "./SetMap";
import type { ThrowSet } from "./ThowSet";

export type WeekNames = ThrowSet<string>

export type ExerciseProperties = SetMap<string,ThrowSet<string>>
export type Exercises = SetMap<string, ExerciseProperties>

export type Groups = SetMap<string, ThrowSet<string>>

export type ExercisePlan = {
    exerciseName: string,
    sets: number[];
}
export type WorkoutPrograms = SetMap<string, ExercisePlan[]>