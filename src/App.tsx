import './App.css';
import LevelGenerator from "./levels/LevelGenerator";
import {useKeyPress} from "./hooks/useKeyPress";

export default function App () {

    const moveUp = useKeyPress("w");
    const moveDown = useKeyPress("s");
    const moveLeft = useKeyPress("a");
    const moveRight = useKeyPress("d");

    return (
        <>
            <div>
                <div>h, s, r, f</div>
                <div>
                    {moveUp && "😊"}
                    {moveDown && "😢"}
                    {moveLeft && "🤖"}
                    {moveRight && "🦊"}
                </div>
            </div>


            {/*<LevelMap mapDimensions={DIMENSIONS} mapMaxTunnelLength={MAX_TUNNEL_LENGTH} mapMaxTunnels={MAX_TUNNELS} />*/}
            <LevelGenerator />

        </>
    );
}

