/*
    Description:
    An extension of the built-in Set but with some extra features:
        * Throws error whe trying to insert duplicate.
        * Throws error when attempting to delete a element that does not exist in the set
*/

import { NoKeyInSetError, KeyAlreadyExistsError } from "./SetErrors"

export class ThrowSet<V> extends Set<V>{
    constructor(){
        super()
    }

    //TODO: typeset this error for better error handling
    override add(value: V): this {
        if(this.has(value)) throw new KeyAlreadyExistsError(value) 
        super.add(value)
        return this
    }

    //TODO: 
    // * preserves set order
    update(oldValue: V, newValue: V): this {
        if (!this.has(oldValue)) throw new NoKeyInSetError(oldValue) 
        super.delete(oldValue)
        super.add(newValue)
        return this
    }

    override delete(value: V): boolean {
        if (!this.has(value)) throw new NoKeyInSetError(value) 
        super.delete(value) 
        return true
    }
}