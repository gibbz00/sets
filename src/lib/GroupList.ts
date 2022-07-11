export type Group = {
    name: string
    //TODO: should not be possible to add duplicates
    tags: string[]
}

const muscleGroups: string[] = [
    "Quad", //0
    "Hamstring", //1
    "Calves", //2
    "Glutes", //3
    "Delts Posterior", //4
    "Delts Medial", //5
    "Delts Anterior", //6
    "Biceps", //7
    "Triceps", //8
    "Lower Back", //9
    "Upper Back", //10
    "Lower Chest", //11
    "Upper Chest", //12
    "Abdominals" //13
   ]
   
const groupsSeed: Group[] = [
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
