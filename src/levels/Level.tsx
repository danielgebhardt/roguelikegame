import {Typography} from "@mui/material";
import {useState} from "react";

interface LevelProps {
    level?: string[][] | undefined;
}

const Level: React.FC<LevelProps> = ({ level }) => {
    const [currentLevel, setCurrentLevel] = useState<string[][]>(level ?? []);

    return (
        <div>
            <table>
                <tbody>
                {currentLevel.map((row, index) => {
                    return (
                        <tr key={index}>
                            {row.map((column, rowIndex) => {
                                return (
                                    <td key={rowIndex}>{(column === '@') ?
                                        <Typography sx={{color: '#fff'}} component={"span"}
                                                    variant={"subtitle1"}>{column}</Typography> :
                                        <Typography component={"span"} variant={"subtitle1"}>{column}</Typography>}</td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    )
};

export default Level;