import {useParams} from "react-router-dom";
import {loadGame} from "../../lib/storage.ts";
import {useCallback, useEffect, useState} from "react";
import Loading from "../../components/Loading.tsx";
import {Countdown} from "../../components/Countdown.tsx";
import MoveSelector from "../../components/MoveSelector.tsx";
import {Button} from "../../components/Button.tsx";
import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store/store.ts";
import {fetchGameInfo} from "../../store/RpsContractSlice.ts";
import {RpsFactory} from "../../lib/rps.ts";
import {getCurrentUser} from "../../store/web3Slice.ts";
import {GameInfoField} from "./components/GameInfoField.tsx";
import {usePerformAsyncAction} from "../../hooks/usePerformAsyncAction.ts";

function SolveGame() {
  const dispatch = useDispatch<AppDispatch>();
  const performAction = usePerformAsyncAction();

  const {contractAddress} = useParams<string>()

  useEffect(() => {
    dispatch(fetchGameInfo(contractAddress!));
    dispatch(getCurrentUser());
  }, []);

  const gameInfo = useAppSelector((state) => state.rpsContract.GameInfo);
  const loading = useAppSelector((state) => state.rpsContract.loading);
  const currentUser = useAppSelector((state) => state.web3.currentUser);


  const game = loadGame(); // Only reason game could be null is if the user clears the cache, or if they are using a different browser
  const [salt, setSalt] = useState<number>(game?.salt || 0);
  const [move, setMove] = useState<number>(game?.move || 0);

  if (loading) return (<Loading/>)
  const {c2Move, player1, player2, stake, timeout, lastAction, c1Hash} = gameInfo;

  const gameIsOver = c2Move > 0 && stake == '0.0';
  const timeLeft = timeout - (Math.floor(Date.now() / 1000) - lastAction);

  const onSolve = () => performAction(async () => {
    await (await RpsFactory.getReadWriteContract(contractAddress!)).Solve(move, salt)
  });

  const claimTimeout = () => performAction(async () => {
    await (await RpsFactory.getReadWriteContract(contractAddress!)).TimeOutForPlayer1()
  });

  const onSaltChange = (salt: string) => {
    const saltNumber = Number(salt);
    if (isNaN(saltNumber)) {
      console.error("Salt is not a number")
      return;
    }

    setSalt(saltNumber);
  }

  const onMoveChanged = useCallback((move: number) => setMove(move), []);


  const moveToString = (move: number) => {
    switch (move) {
      case 1:
        return "Rock";
      case 2:
        return "Paper";
      case 3:
        return "Scissors";
      case 4:
        return "Spock";
      case 5:
        return "Lizard";
      default:
        return "Unknown";
    }

  }

  return (
    <>
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Game Information</h2>

        <div className="flex flex-wrap -mx-2">
          <GameInfoField label="Player 1" data={player1}/>
          <GameInfoField label="Player 2" data={player2}/>
          <GameInfoField label="C1 Hash" data={c1Hash}/>
          <GameInfoField label="C2 Move" data={moveToString(c2Move)}/>
          <GameInfoField label="Stake" data={`${stake} ETH`}/>
          <GameInfoField label="Last Action" data={new Date(lastAction * 1000).toLocaleString()}/>
          <GameInfoField label="Time left to solve" data={<Countdown timeLeft={timeLeft}/>}/>
        </div>
      </div>

      {gameIsOver && (
        <div className="text-center bg-red-100 p-4 rounded-md mb-4">
          <p className="text-red-600 text-2xl font-bold">Game is over</p>
        </div>
      )}

      {(currentUser === player1 && !gameIsOver) && (
        <>
          <div className="flex flex-row justify-center mb-4">
            <input
              className="border-2 border-blue-500 rounded-lg p-2 w-1/3 focus:outline-none focus:border-blue-700"
              type="text"
              placeholder="Enter your salt"
              value={salt.toString()}
              onChange={(e) => onSaltChange(e.target.value)}
            />
          </div>

          <MoveSelector onMoveSelect={onMoveChanged} selectedMove={move}/>

          <div className="flex flex-row justify-center mt-4">
            <Button onClick={onSolve}>Solve</Button>
          </div>
        </>
      )}

      {(currentUser === player2 && !gameIsOver) && (
        <div className="flex flex-row justify-center mt-4">
          <Button onClick={claimTimeout} disabled={timeLeft > 0}>Claim timeout</Button>
        </div>
      )}

      {currentUser !== player1 && currentUser !== player2 && (
        <div className="text-center bg-yellow-100 p-4 rounded-md mb-4">
          <p className="text-yellow-600 text-2xl font-bold">Not your game</p>
        </div>
      )}
    </>
  );
}


export default SolveGame
