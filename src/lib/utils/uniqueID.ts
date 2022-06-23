type IdentifierMap = {[k: string]: string}

export default function makeUniqueDOMIDs(names: Array<string>, identifier: string): IdentifierMap {
    return names.reduce<IdentifierMap>((acc, cur) => {
        acc[cur] = `${cur}-${identifier}` 
        return acc
    }, {})
}