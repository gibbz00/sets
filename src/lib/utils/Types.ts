import type { Readable } from "svelte/store";
import type { ThrowSet } from "./ThowSet";

export type GroupReference = {
        group: [string, ThrowSet<string>] 
        tags: ThrowSet<string>
}

export type ExercisePlan = {
    exercise: [string, GroupReference[]],
    sets: any[];
}