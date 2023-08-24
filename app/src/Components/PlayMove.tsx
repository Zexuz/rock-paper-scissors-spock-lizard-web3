import {ethers} from "ethers";
import MoveSelector from "./MoveSelector.tsx";
import {RPS_CONTRACT} from "../config.ts";
import {Link, useParams} from "react-router-dom";
import {Countdown} from "./Countdown.tsx";
import {Button} from "./Button.tsx";
import useContractData from "../hooks/useGameInfo.ts";


function PlayMove() {
  const {contractAddress} = useParams<string>()
  const {gameInfo, currentUser} = useContractData(contractAddress);

  const onClick = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress!, RPS_CONTRACT.abi, signer);

    const move = 1 // ROCK

    const tx = await contract.play(move, {value: ethers.parseEther("0.1")});
    console.log(`Transaction hash: ${tx.hash}`);
  }

  const timeOut = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress!, RPS_CONTRACT.abi, signer);

    const tx = await contract.j2Timeout();
    console.log(`Transaction hash: ${tx.hash}`);
  }

  if (!gameInfo) return (<div>Loading...</div>)

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

        <MoveSelector onMoveSelect={() => {
        }}/>

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
