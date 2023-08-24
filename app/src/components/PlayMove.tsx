import {ethers} from "ethers";
import MoveSelector from "./MoveSelector.tsx";
import { useNavigate, useParams} from "react-router-dom";
import {Countdown} from "./Countdown.tsx";
import {Button} from "./Button.tsx";
import useContractStore from "../store/contract.ts";
import {useEffect, useState} from "react";
import Loading from "./Loading.tsx";


function PlayMove() {
  const {contractAddress} = useParams<string>()
  const {gameInfo, currentUser, reloadGameInfo, initialize, setContractAddress, timeOutForPlayer, play} = useContractStore();
  const [move, setMove] = useState(gameInfo?.c2Move || 0);
  const [havePlayed, setHavePlayed] = useState(gameInfo?.c2Move === 0);
  const navigate = useNavigate()

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
    setHavePlayed(true);
  }

  const timeOut = async () => {
    await timeOutForPlayer(2);
  }

  const navigateToNextPage = () => {
    navigate(`/play/${contractAddress}/solve`)
  }

  if (!gameInfo) return (<Loading/>)

  const timeLeft = gameInfo.timeout - (Math.floor(Date.now() / 1000) - gameInfo.lastAction);
  const canPlayer1Timeout = currentUser === gameInfo.player1 && timeLeft <= 0;
  const disabled = currentUser !== gameInfo?.player2;
  const haveC2Moved = gameInfo.c2Move !== 0;

  return (
    <>
      <div className="p-4 space-y-4">

        <h1 className="text-3xl font-semibold text-center text-blue-600">Opponents Move</h1>

        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Player 1: {gameInfo.player1} vs Player
            2: {gameInfo.player2}</h2>
          <h2 className="text-lg text-gray-600">Stake: {gameInfo.stake} ETH</h2>
          <Countdown timeLeft={gameInfo.timeout - (Math.floor(Date.now() / 1000) - gameInfo.lastAction)}/>
        </div>

        <MoveSelector onMoveSelect={setMove} selectedMove={move}/>

        <div className={"flex justify-center space-x-8"}>
          <Button disabled={!canPlayer1Timeout} onClick={timeOut}>Timeout for Player 1</Button>
        </div>

        <div className="text-center">
          <Button
            onClick={onClick}
            disabled={disabled || haveC2Moved || !move}
          >
            Commit move
          </Button>
        </div>
        {(haveC2Moved || havePlayed) && (
          <div className={'flex flex-row justify-center'}>
            <Button onClick={navigateToNextPage}>Click here to go to next page</Button>
          </div>
        )}
      </div>
    </>
  )
}


export default PlayMove
