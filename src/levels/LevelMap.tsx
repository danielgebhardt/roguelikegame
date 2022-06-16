import {useState} from "react";
import '../App.css'

type LevelMapProps = {
    mapDimensions: number,
    mapMaxTunnels: number,
    mapMaxTunnelLength: number
};

const LevelMap = ({mapDimensions, mapMaxTunnels, mapMaxTunnelLength}: LevelMapProps) => {

    const createArray = (num: number, levelDimensions: number) => {
        let array = [];
        for (let i: number = 0; i < levelDimensions; i++) {
            array.push([] as number[]);
            for (let j: number = 0; j < levelDimensions; j++) {
                array[i].push(num);
            }
        }
        return array;
    };

    const createLevelMap = () => {
        let dimensions = mapDimensions;
        let maxTunnelLength = mapMaxTunnelLength;
        let maxTunnels = mapMaxTunnels;

        // create the 2d array that will be the level map
        let map = createArray(1, dimensions);

        // up, down, left, right
        const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        // random starting point
        let currentRow = Math.floor(Math.random() * dimensions);
        let currentColumn = Math.floor(Math.random() * dimensions);
        let randomDirection;
        let lastDirection: number[] = [];



        while (maxTunnels > 0) {
            // decide how long this tunnel will be
            let randomLength = Math.ceil(Math.random() * maxTunnelLength);
            let tunnelLength = 0;

            // get a random direction that isn't the opposite of the last random direction (going backwards)
            do {
                randomDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
            } while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) ||
            (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1]));

            while (tunnelLength < randomLength) {
                if (((currentRow === 0) && (randomDirection[0] === -1)) ||
                    ((currentColumn === 0) && (randomDirection[1] === -1)) ||
                    ((currentRow === (mapDimensions - 1)) && (randomDirection[0] === 1)) ||
                    ((currentColumn === (mapDimensions - 1)) && (randomDirection[1] === 1))) {
                    break;
                } else {
                    map[currentRow][currentColumn] = 0;
                    currentRow += randomDirection[0];
                    currentColumn += randomDirection[1];
                    tunnelLength++;
                }
            }

            if (tunnelLength) { // update our variables unless our last loop broke before we made any part of a tunnel
                lastDirection = randomDirection; //set lastDirection, so we can remember what way we went
                maxTunnels--;; // we created a whole tunnel so lets decrement how many we have left to create
            }
        }

        return map;
    }

    let grid = createLevelMap();

    return (
        <>
            <div>
                <table className="grid">
            <thead>
                {grid.map((obj, row) =>
                        <tr key={row}>{obj.map((obj2, col) =>
                                <td className={obj2 === 1 ? 'wall' : 'tunnel'} key={col}></td>)}</tr>)}
    </thead>
    </table>
    </div>
    </>
);
};

    export default LevelMap;