// Strongly typed props/events/slots are fully there yet
// https://github.com/sveltejs/rfcs/pull/38
export type FilterFunction = ( key: string, items: string[]) => string[]
export type SelectedEventDetail = {
    selected: string,
    method: 'selection' | 'traversal'
}
export type SelectedEvent = (
    type: 'selected', 
    detail: SelectedEventDetail
) => boolean 