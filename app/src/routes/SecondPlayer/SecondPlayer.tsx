import {ethers} from "ethers";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button} from "../../components/Button";
import MoveSelector from "../../components/MoveSelector";
import {Countdown} from "../../components/Countdown.tsx";
import Loading from "../../components/Loading.tsx";
import useContractStore from "../../store/contract.ts";


function SecondPlayer() {
  const {contractAddress} = useParams<string>()
  const {gameInfo, currentUser, getCurrentUser, reloadGameInfo, setContractAddress, timeOutForPlayer, play} = useContractStore();
  const [move, setMove] = useState(gameInfo?.c2Move || 0);
  const [havePlayed, setHavePlayed] = useState(gameInfo?.c2Move === 0);
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      setContractAddress(contractAddress!)
      await getCurrentUser()
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
  const isSecondPlayer = currentUser === gameInfo.player2;
  const haveC2Moved = gameInfo.c2Move !== 0;


  console.log(`!isSecondPlayer ${!isSecondPlayer}, haveC2Moved ${haveC2Moved}, move === 0 ${move === 0}`);
  console.log(`Current user: ${currentUser}, player 2: ${gameInfo.player2}`)
  console.log(`!isSecondPlayer || haveC2Moved || move === 0, ${!isSecondPlayer || haveC2Moved || move === 0}`)


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

        {currentUser === gameInfo.player1 && (
          <div className={"flex justify-center space-x-8"}>
            <Button disabled={!canPlayer1Timeout} onClick={timeOut}>Timeout for Player 1</Button>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={onClick}
            disabled={!isSecondPlayer || haveC2Moved || move === 0 || havePlayed}
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


export default SecondPlayer
