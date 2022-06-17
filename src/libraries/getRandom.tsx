export default function getRandom(minRandom: number, maxRandom: number) {
    return Math.floor(Math.random() * (maxRandom - minRandom + 1)) + minRandom;
}