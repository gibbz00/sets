export function autocompleteFilter(textFieldValue: string, items: string[]): string[] {
	/*
        Description:
            * Autoselect option
                * Case-sensitive whole pattern based on textFieldValue 
                * Match starts only at first index 
                * Empty input means that every element is a potential match
    */

	// Then we iterate over each letter of the input and pick only those match charachter-wise
	let potentialMatches: string[] = items
	for (let index = 0; index < textFieldValue.length; index++) {
		potentialMatches = potentialMatches.filter((potentialMatch) => {
			if (potentialMatch.charAt(index) == textFieldValue.charAt(index)) {
				return potentialMatch
			}
		})
	}
	return potentialMatches
}
