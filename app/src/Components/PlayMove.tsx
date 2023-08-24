import {ethers} from "ethers";
import MoveSelector from "./MoveSelector.tsx";
import {RPS_CONTRACT} from "../config.ts";
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Countdown} from "./Countdown.tsx";
import {Button} from "./Button.tsx";


interface GameInfo {
  player1: string,
  player2: string,
  c1Hash: string,
  c2Move: number,
  stake: string,
  timeout: number,
  lastAction: number
}

function PlayMove() {
  const {contractAddress} = useParams<string>()
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null)
  const [currentUser, setCurrentUser] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const user = await signer.getAddress();
      setCurrentUser(user);

      const contract = new ethers.Contract(contractAddress!, RPS_CONTRACT.abi, provider);

      const j1 = await contract.j1();
      const j2 = await contract.j2();
      const c1Hash = await contract.c1Hash();
      const c2 = await contract.c2();
      const stake = await contract.stake();
      const timeout = await contract.TIMEOUT();
      const lastAction = await contract.lastAction();

      console.log(j1, j2, c1Hash, stake, timeout, lastAction)

      setGameInfo({
        player1: j1,
        player2: j2,
        c1Hash: c1Hash,
        c2Move: Number(c2),
        stake: ethers.formatEther(stake),
        timeout: Number(timeout),
        lastAction: Number(lastAction)
      })
    })();
  }, []);

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
