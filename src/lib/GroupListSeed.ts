import type { Group } from "./GroupList"
import { GroupList } from "./GroupList"

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

export let seededGroupList = ((): GroupList => {
    let groupList = new GroupList()
    //Populate list
    //TEMP: maybe do this be reading a json in the future
    for (let group of groupsSeed) {
        groupList.add(group)
    }
    return groupList
})()