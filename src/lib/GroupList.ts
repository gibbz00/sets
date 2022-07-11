export type Group = {
    name: string
    //TODO: should not be possible to add duplicates
    tags: string[]
}

// Might be better to just use Set ADT
export class GroupList {
    readonly groups: Group[] = []

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
