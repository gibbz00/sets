export type Group = {
    name: string
    tags: string[]
}

const muscleGroups: string[] = [
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
   
export let groupsSeed: Group[] = [
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

// Might be better to just use Set ADT
export class GroupList {
    readonly groups: Group[] = []

    constructor(){
        //Populate list
        //TEMP: maybe do this be reading a json in the future
        for (let group of groupsSeed) {
            this.add(group)
        }
    }

    public add(group: Group): void {
       //TODO: type-set error for easier error handling
       if (this.find(group.name)) throw new Error("Exercise by the same name aleady exists")
       else {
        this.groups.push(group)
       }
    }

    // Possible optimization would be to make this O(1) with hashmaps
    // Or maybe use the Set ADT
    public find(groupName: string): Group | false {
        for(let group of this.groups) {
            if (group.name == groupName) return group
        }
        return false
    }
}
