type exercisePlan = {
    //TODO: make this a reference to the exercise database
    name: string,
    sets: number[]
}
type workoutDay = {
    name: string,
    exercisePlans: exercisePlan[]
}

export let program: workoutDay[] = [
    {
        name: "Monday",
        exercisePlans:  [
            { name: "Benchpress",  sets: [2,3,3,4] },
            { name: "T-bar row",  sets: [2,3,3,4] },
            { name: "Incline dumbell press",  sets: [2,2,3,4] },
            { name: "Close-grip pull down",  sets: [2,2,3,4] }
        ]
    },
    {
        name: "Tuesday",
        exercisePlans:  [
            { name: "Squat",  sets: [2,2,3,4] },
            { name: "Donkey calf raise",  sets: [2,2,3,4] }
        ]
    },
    {
        name: "Wednesday",
        exercisePlans:  [
            { name: "Overhead barbell press",  sets: [2,3,3,4] },
            { name: "Cable chins",  sets: [2,3,3,4] },
            { name: "Reverse pec-deck",  sets: [2,3,3,4] }
        ]
    },
    {
        name: "Thursday",
        exercisePlans:  [
            { name: "Dumbell press",  sets: [2,3,3,4] },
            { name: "Dumbell pull",  sets: [2,3,3,4] },
            { name: "Dips",  sets: [2,2,3,4] },
            { name: "Lat pull down",  sets: [2,2,3,4] },
        ]
    },
    {
        name: "Friday",
        exercisePlans:  [
            { name: "Sumo deadlift",  sets: [2,3,3,4] },
            { name: "Hamstring curl",  sets: [2,3,3,4] },
            { name: "Leg extension",  sets: [2,2,3,4] },
            { name: "Smith-machine calf raise",  sets: [2,2,3,4] },
        ]
    },
    {
        name: "Saturday",
        exercisePlans:  [
            { name: "Overhead dumbell press",  sets: [2,3,3,4] },
            { name: "Bicep curl",  sets: [2,3,3,4] },
            { name: "Tricep extension",  sets: [2,2,3,4] },
            { name: "Smith-machine calf raises",  sets: [2,2,3,4] },
        ]
    }
]

type Exercise = {
    name: string,
    //FIX: proper type-setting
    tags: unknown,
}

export let exercises: Exercise[] = [
    {
        name:  "Bench press",
        tags: [
            [0, [1,2,3]]
        ]
    },
    {
        name:  "Dips",
        tags: [
            [0, [1,2,3]]
        ]
    },
    {
        name:  "Squats",
        tags: [
            [0, [1,2,3]]
        ]
    },
    {
        name:  "Deadlift",
        tags: [
            [0, [1,2,3]]
        ]
    }
]

type Group = {
    name: string
    tags: string[]
}

let muscleGroups: string[] = [
 "Quad",
 "Hamstring",
 "Calves",
 "Glutes",
 "Delts Posterior",
 "Delts Medial",
 "Biceps",
 "Triceps",
 "Lower Back",
 "Upper Back",
 "Lower Chest",
 "Upper Chest",
 "Abdominals"
]

let groups: Group[] = [
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
