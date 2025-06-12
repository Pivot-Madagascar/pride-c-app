export const getLevelNames = (id, levels) => {
    const currentElement = levels.find((element) => element.id === id)
    if (currentElement) {
        const currentLevelName = currentElement.name
        const parentLevel = currentElement.level - 1
        const parentLevelElement = levels.find(
            (element) => element.level === parentLevel
        )
        const parentLevelName = parentLevelElement
            ? parentLevelElement.name
            : null
        return [parentLevelName, currentLevelName]
    }
    return null
}
