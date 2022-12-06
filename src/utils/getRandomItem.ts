export const getRandomItem = <T>(items: T[]) => {
    return items[Math.floor(Math.random() * items.length)];
}
