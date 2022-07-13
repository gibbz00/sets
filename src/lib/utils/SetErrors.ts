export class NoKeyInSetError extends Error {
    constructor(key: any) {
        super(`${key} does not exist in set`)
    }
}

export class KeyAlreadyExistsError extends Error {
    constructor(key: any) {
        super(`${key} already exists in set. Use update() if you're trying to update a value`)
    }
}