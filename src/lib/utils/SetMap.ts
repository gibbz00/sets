/*
    Description:
    An extension of the built-in Map but with some extra features:
        * Keys have set properties in that they must be unique
            * Throws error whe trying to insert duplicate.
            * Updates are done with the update() method
                * Throws error if key does not exist
        * Throws error when attempting to delete a element that does not exist in the set
        * get() returns a reference to both the key and the value
            * makes easier to create references to the entire entry
        * BUG: not possible to override function return types in TS 
        *   I can't find the source code for a Map implementation.
        *   Instead I'll use a different method name and an looping over each entry in the map.
        *   Far from ideal but works for now.
*/

import { KeyAlreadyExistsError, NoKeyInSetError } from "./SetErrors";

export class SetMap<K, V> extends Map<K, V>{
    constructor(){
        super()
    }

    getEntry(searchKey: K): [K, V] {
        for (let [key, value] of this.entries()) {
            if (key === searchKey) return [key, value]
        }
        throw new NoKeyInSetError(searchKey);
    }

    override set(key: K, value: V): this {
        if(this.has(key)) throw new KeyAlreadyExistsError(key)
        super.set(key, value)
        return this
    }

    update(key: K, value: V): this {
        if (!this.has(key)) throw new NoKeyInSetError(key)
        super.set(key, value)
        return this
    }

    override delete(key: K): boolean {
        if (!this.has(key)) throw new NoKeyInSetError(key)
        super.delete(key) 
        return true
    }
}