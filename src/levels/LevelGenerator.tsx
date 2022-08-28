import {Leaf, Point} from "./Leaf";
import getRandom from "../libraries/getRandom";

export type GeneratedLevel = {
    level: string[][],
    startingPosition: Point
};

const levelGenerator = ():GeneratedLevel => {
    const MAX_LEAF_SIZE = 15; // 20
    const MIN_LEAF_SIZE = 5; // 6
    const LEVEL_NUM_ROWS = 30; // 40
    const LEVEL_NUM_COLS = 40; // 40

    const generateLevel = (m: number, n: number) => [...Array(m)].map(e => Array(n).fill('#'));
    // initiate array of current level. For now, must be a square or it breaks for some reason
    const currentLevel = generateLevel(LEVEL_NUM_ROWS, LEVEL_NUM_COLS);
    let startingPosition:Point = {rowNumber: 0, columnNumber: 0};

    let leafs: Leaf[] = [];
    let rootLeaf: Leaf = new Leaf(0, 0, LEVEL_NUM_ROWS, LEVEL_NUM_COLS, MIN_LEAF_SIZE, currentLevel);
    leafs.push(rootLeaf);

    let didSplit = true;

    // we loop through every Leaf in our Vector over and over again, until no more Leafs can be split.
    while (didSplit) {
        didSplit = false;

        for (const eachLeaf of leafs) {
            //if this Leaf is not already split...
            if (!eachLeaf.leftChild && !eachLeaf.rightChild) {
                // if this Leaf is too big, or 75% chance...
                if ((eachLeaf.rows > MAX_LEAF_SIZE) || (eachLeaf.columns > MAX_LEAF_SIZE) || (Math.random() > 0.25)) {
                    if (eachLeaf.splitLeaf()) // split the Leaf!
                    {
                        // if we did split, push the child leafs to the Vector so we can loop into them next
                        leafs.push(eachLeaf.leftChild);
                        leafs.push(eachLeaf.rightChild);
                        didSplit = true;
                    }
                }
            }
        }
    }

    rootLeaf.createRooms();

    // Set character starting position
    let foundRoom = false;
    while (!foundRoom) {
        let randomRoom = getRandom(0, leafs.length);
        // console.log(randomRoom);

        if (leafs[randomRoom].room) {
            foundRoom = true;
            // console.log("found room", leafs[randomRoom].room);
            const startingRoom = leafs[randomRoom].room;

            let randomXInRoom = getRandom(startingRoom.rowNumber, startingRoom.rowNumber + startingRoom.rows - 1);
            let randomYInRoom = getRandom(startingRoom.columnNumber, startingRoom.columnNumber + startingRoom.columns - 1);

            // console.log(randomXInRoom, randomYInRoom);

            currentLevel[randomXInRoom][randomYInRoom] = '@';

            // console.log({row: randomXInRoom, column: randomYInRoom});
            startingPosition = {rowNumber: randomXInRoom, columnNumber: randomYInRoom};
        }
    }

    return ({level: currentLevel, startingPosition: startingPosition});
};

export default levelGenerator;
