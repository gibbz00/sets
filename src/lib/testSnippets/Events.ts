export type SelectedEvent = (type: 'selected', detail: HTMLInputElement['value']) => boolean
export type CanceledEvent = (type: 'canceled') => boolean
