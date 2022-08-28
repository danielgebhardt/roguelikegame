import './App.css';
import levelGenerator, {GeneratedLevel} from "./levels/LevelGenerator";
import Level from "./levels/Level";
import {useCallback, useEffect, useState} from "react";
import {Point} from "./levels/Leaf";

export default function App() {
    const [currentLevel, setCurrentLevel] = useState<string[][]>(Array([]));
    const [characterPosition, setCharacterPosition] = useState<Point>({rowNumber: 0, columnNumber: 0});

    useEffect(() => {
        const generatedLevel: GeneratedLevel = levelGenerator();
        setCurrentLevel(generatedLevel.level);
        setCharacterPosition(generatedLevel.startingPosition);
    }, []);

    // Add event listeners
    useEffect(() => {
        window.addEventListener("keyup", upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keyup", upHandler);
        };
    }, [characterPosition]); // Empty array ensures that effect is only run on mount and unmount

    const updateCharacterPosition = (up: number, right: number, key: string) => {
        setCharacterPosition(prevState => ({
            rowNumber: prevState.rowNumber + up,
            columnNumber: prevState.columnNumber + right
        }));
        const tempLevel = currentLevel;
        tempLevel[characterPosition.rowNumber][characterPosition.columnNumber] = ' ';
        tempLevel[characterPosition.rowNumber + up][characterPosition.columnNumber + right] = '@';
        setCurrentLevel(tempLevel);
    };

    const upHandler = ({key}: any) => {
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
    };

    return (
        <>
            <Level level={currentLevel}/>
        </>
    );
}

