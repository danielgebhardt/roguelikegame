import {Leaf} from "./Leaf";

const LevelGenerator = () => {
    const generateLevel = (m: number, n: number) => [...Array(m)].map(e => Array(n).fill('#'));

    const MAX_LEAF_SIZE = 20;
    const MIN_LEAF_SIZE = 6;
    const LEVEL_WIDTH = 50;
    const LEVEL_HEIGHT = 50;

    const currentLevel = generateLevel(LEVEL_WIDTH, LEVEL_HEIGHT);

    let leafs: Leaf[] = [];
    let rootLeaf: Leaf = new Leaf(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT, MIN_LEAF_SIZE, currentLevel);
    leafs.push(rootLeaf);

    let didSplit = true;

// we loop through every Leaf in our Vector over and over again, until no more Leafs can be split.
    while (didSplit) {
        didSplit = false;

        for (const eachLeaf of leafs) {
            //if this Leaf is not already split...
            if (!eachLeaf.leftChild && !eachLeaf.rightChild) {
                // if this Leaf is too big, or 75% chance...
                if ((eachLeaf.width > MAX_LEAF_SIZE) || (eachLeaf.height > MAX_LEAF_SIZE) || (Math.random() > 0.25)) {
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


    return (
        <>
            <table>
                <tbody>
                {currentLevel.map((row, index) => {
                    return (
                        <tr key={index}>
                            {row.map((column, rowIndex) => {
                                return (
                                    <td key={rowIndex}>{column}</td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </>
    );
};

export default LevelGenerator;
