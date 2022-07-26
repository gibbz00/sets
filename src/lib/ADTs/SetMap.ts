/*
    Description:
    An extension of the built-in Map but with some extra features:
        * Keys have set properties in that they must be unique
            * Throws error whe trying to insert duplicate.
            * Updates are done with the update() method
                * Throws error if key does not exist
        * Throws error when attempting to delete a element that does not exist in the set
        * BUG: not possible to override function return types in TS, hence the getDefined
*/

import { KeyAlreadyExistsError, NoKeyInSetError } from './SetErrors'

export class SetMap<K, V> extends Map<K, V> {
	constructor() {
		super()
	}

	getDefined(key: K): V {
		if (!this.has(key)) throw new NoKeyInSetError(key)
		return super.get(key) as V
	}

	override set(key: K, value: V): this {
		if (this.has(key)) throw new KeyAlreadyExistsError(key)
		super.set(key, value)
		return this
	}

	update(key: K, value: V): this {
		if (!this.has(key)) throw new NoKeyInSetError(key)
		super.set(key, value)
		return this
	}

	// Preserver order and update key:
	// HACK: shitty performance that will be uneccesary if I granularize the svelte stores and use each keys in in html templating
	updateKeyPreserveOrder(oldKey: K, newKey: K): this {
		if (this.has(oldKey)) {
			let tempArray = Array.from(this.entries())
			let index = tempArray.findIndex(([key], index) => {
				if (key === oldKey) return true
			})
			tempArray[index][0] = newKey

			this.clear()
			for (let [key, value] of tempArray) {
				this.set(key, value)
			}
			return this
		} else {
			throw new NoKeyInSetError(oldKey)
		}
	}

	deleteThisReturn(key: K): this {
		if (!this.has(key)) throw new NoKeyInSetError(key)
		super.delete(key)
		return this
	}
}
