import './App.css';
import levelGenerator, {GeneratedLevel} from "./levels/LevelGenerator";
import Level from "./levels/Level";
import {useCallback, useEffect, useState} from "react";
import {Point} from "./levels/Leaf";

export default function App() {
    const [characterPosition, setCharacterPosition] = useState<Point>({rowNumber: 0, columnNumber: 0});
    const [currentLevel, setCurrentLevel] = useState<string[][]>(Array([]));
    const isAbleToMove = useCallback((newLocation: Point):boolean => {
        return currentLevel[characterPosition.rowNumber + newLocation.rowNumber][characterPosition.columnNumber + newLocation.columnNumber] !== '#';
    }, [characterPosition.columnNumber, characterPosition.rowNumber, currentLevel]);
    const updateCharacterPosition = useCallback((up: number, right: number, key: string) => {
        if(isAbleToMove({rowNumber: up, columnNumber: right})) {
            setCharacterPosition(prevState => ({
                rowNumber: prevState.rowNumber + up,
                columnNumber: prevState.columnNumber + right
            }));
            const tempLevel = currentLevel;
            tempLevel[characterPosition.rowNumber][characterPosition.columnNumber] = ' ';
            tempLevel[characterPosition.rowNumber + up][characterPosition.columnNumber + right] = '@';
            setCurrentLevel(tempLevel);
        } else {
            console.log("Would hit a wall");
        }

    }, [characterPosition.rowNumber, characterPosition.columnNumber, currentLevel, isAbleToMove]);
    const upHandler = useCallback(({key}: any) => {
        switch (key) {
            case 'w':
                updateCharacterPosition(-1, 0, key);
                break;
            case 's':
                updateCharacterPosition(1, 0, key);
                break;
            case 'a':
                updateCharacterPosition(0, -1, key);
                break;
            case 'd':
                updateCharacterPosition(0, 1, key);
                break;
            case 'q':
                updateCharacterPosition(-1, -1, key);
                break;
            case 'e':
                updateCharacterPosition(-1, 1, key);
                break;
            case 'z':
                updateCharacterPosition(1, -1, key);
                break;
            case 'x':
                updateCharacterPosition(1, 1, key);
                break;
            default:
        }
    }, [updateCharacterPosition]);

    useEffect(() => {
        const generatedLevel: GeneratedLevel = levelGenerator();
        setCurrentLevel(generatedLevel.level);
        setCharacterPosition(generatedLevel.startingPosition);
    }, []);

    useEffect(() => {
        window.addEventListener("keyup", upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keyup", upHandler);
        };
    }, [upHandler]);

    return (
        <>
            <Level level={currentLevel}/>
        </>
    );
}

