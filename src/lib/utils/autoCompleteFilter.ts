import type { FilterFunction } from "./FilterFunction"

export let autocompleteFilter: FilterFunction = ( filterKey: string, items: string[]) => {
	/*
        Description:
            * Autoselect option
                * Case-sensitive whole pattern based on filterKey 
                * Match starts only at first index 
                * Empty input means that every element is a potential match
    */

	// Then we iterate over each letter of the input and pick only those match charachter-wise
	let potentialMatches: string[] = items
	for (let index = 0; index < filterKey.length; index++) {
		potentialMatches = potentialMatches.filter((potentialMatch) => {
			if (potentialMatch.charAt(index) == filterKey.charAt(index)) {
				return potentialMatch
			}
		})
	}
	return potentialMatches
}
