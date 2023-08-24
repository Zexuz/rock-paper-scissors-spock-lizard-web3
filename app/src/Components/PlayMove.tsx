import {ethers} from "ethers";
import MoveSelector from "./MoveSelector.tsx";
import {Link, useParams} from "react-router-dom";
import {Countdown} from "./Countdown.tsx";
import {Button} from "./Button.tsx";
import useContractStore from "../store/contract.ts";
import {useEffect, useState} from "react";
import Loading from "./Loading.tsx";


function PlayMove() {
  const {contractAddress} = useParams<string>()
  const {gameInfo, currentUser, reloadGameInfo, initialize, setContractAddress, timeOutForPlayer, play} = useContractStore();
  const [move, setMove] = useState(0);

  useEffect(() => {
    (async () => {
      setContractAddress(contractAddress!)
      await initialize()
      await reloadGameInfo()
    })()
  }, []);

  const onClick = async () => {
    if (!gameInfo) return;
    await play(move, ethers.parseEther(gameInfo.stake));
  }

  const timeOut = async () => {
    await timeOutForPlayer(2);
  }

  if (!gameInfo) return (<Loading/>)

  const timeLeft = gameInfo.timeout - (Math.floor(Date.now() / 1000) - gameInfo.lastAction);
  const canPlayer1Timeout = currentUser === gameInfo.player1 && timeLeft <= 0;
  const disabled = currentUser !== gameInfo?.player2;
  const haveC2Moved = gameInfo.c2Move !== 0;

  return (
    <>
      <div className="p-4 space-y-4">

        <h1 className="text-3xl font-semibold text-center text-blue-600">Play move</h1>
        <h2 className="text-xl font-medium text-center text-blue-500">Contract address: {contractAddress}</h2>

        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Player 1: {gameInfo.player1} vs Player
            2: {gameInfo.player2}</h2>
          <h2 className="text-lg text-gray-600">Stake: {gameInfo.stake} ETH</h2>
          <Countdown timeLeft={gameInfo.timeout - (Math.floor(Date.now() / 1000) - gameInfo.lastAction)}/>
        </div>

        <MoveSelector onMoveSelect={setMove}/>

        <div className={"flex justify-center space-x-8"}>
          <Button disabled={!canPlayer1Timeout} onClick={timeOut}>Timeout for Player 1</Button>
        </div>

        <div className="text-center">
          <Button
            onClick={onClick}
            disabled={disabled || haveC2Moved}
          >
            Commit move
          </Button>
        </div>
        {haveC2Moved && (
          <div className={'flex flex-row justify-center'}>
            <Link to={`/play/${contractAddress}/solve`}>
              <p>Solve</p>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}


export default PlayMove
