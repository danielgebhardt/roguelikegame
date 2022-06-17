import './App.css';
import LevelMap from "./unused-old/LevelMap";
import {useEffect} from "react";
import LevelGenerator from "./levels/LevelGenerator";

const DIMENSIONS = 30;
const MAX_TUNNELS = 120;
const MAX_TUNNEL_LENGTH = 10;

export default function App () {

    // useEffect(() => {
    //     const currentLevel = (m: number, n: number) => [...Array(m)].map(e => Array(n).fill('#'));
    //
    //     console.log(currentLevel(10, 10));
    //
    // }, []);

    return (
        <>
            {/*<LevelMap mapDimensions={DIMENSIONS} mapMaxTunnelLength={MAX_TUNNEL_LENGTH} mapMaxTunnels={MAX_TUNNELS} />*/}
            <LevelGenerator />
        </>
    );
}

