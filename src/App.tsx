import './App.css';
import levelGenerator, {GeneratedLevel} from "./levels/LevelGenerator";
import {useKeyPress} from "./hooks/useKeyPress";
import Level from "./levels/Level";
import {useEffect, useState} from "react";
import {Point} from "./levels/Leaf";

export default function App() {

    const [currentLevel, setCurrentLevel] = useState<string[][]>(Array([]));
    const [characterPosition, setCharacterPosition] = useState<Point>({rowNumber: 0, columnNumber: 0});

    useEffect(() => {
        const generatedLevel: GeneratedLevel = levelGenerator();
        setCurrentLevel(generatedLevel.level);
        setCharacterPosition(generatedLevel.startingPosition);
    }, []);

    const updateCharacterPosition = (up:number, right:number) => {
        setCharacterPosition(prevState => ({ rowNumber: prevState.rowNumber + up, columnNumber: prevState.columnNumber + right }));
        console.log({characterPosition});
    };

    const moveUp = useKeyPress("w");
    const moveDown = useKeyPress("s");
    const moveLeft = useKeyPress("a");
    const moveRight = useKeyPress("d");

    const moveUpRight = useKeyPress("e");
    const moveUpLeft = useKeyPress("q");
    const moveDownRight = useKeyPress("x");
    const moveDownLeft = useKeyPress("z");

    moveUp && updateCharacterPosition(1,0);
    moveDown && updateCharacterPosition(-1,0);
    moveRight && updateCharacterPosition(0,1);
    moveLeft && updateCharacterPosition(0,-1);

    moveUpRight && updateCharacterPosition(1,1);
    moveUpLeft && updateCharacterPosition(1,-1);
    moveDownRight && updateCharacterPosition(-1,1);
    moveDownLeft && updateCharacterPosition(-1,-1);

    return (
        <>
            <Level level={currentLevel}/>
        </>
    );
}

