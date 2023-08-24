import {ethers} from "ethers";
import {RPS_CONTRACT} from "../config.ts";
import {useParams} from "react-router-dom";
import {Button} from "./Button.tsx";
import {Countdown} from "./Countdown.tsx";
import useContractStore from "../store/contract.ts";
import Loading from "./Loading.tsx";
import {useEffect} from "react";
import MoveSelector from "./MoveSelector.tsx";

function SolveGame() {
  const {contractAddress} = useParams<string>()
  const {gameInfo: gameData, currentUser, setContractAddress, initialize, reloadGameInfo} = useContractStore();

  useEffect(() => {
    (async () => {
      setContractAddress(contractAddress!)
      await initialize()
      await reloadGameInfo()
    })()
  }, []);

  if (!gameData) return (<Loading/>)

  const yourMove = Number(localStorage.getItem('move') as string);
  const yourSalt = ethers.toBigInt(localStorage.getItem('salt') as string);
  const gameIsOver = gameData.c2Move > 0 && gameData.stake == '0.0';

  const solve = async () => {
    const abi = RPS_CONTRACT.abi;
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress!, abi, signer);

    const tx = await contract.solve(yourMove, yourSalt);
    console.log(`Transaction hash: ${tx.hash}`);
  }

  const claimTimeout = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress!, RPS_CONTRACT.abi, signer);

    await contract.j1Timeout();
  }

  const renderActions = () => {
    if (gameIsOver) return (<p>Game is over</p>);

    if (currentUser === gameData.player1) {
      return (
        <>
          <div className={'flex flex-row justify-center'}>
            <input className={'border-2 border-gray-500 rounded-lg p-2 m-2 w-1/3'}
                   type="text"
                   placeholder={'Enter your salt'}
                   value={yourSalt.toString()}
                   onChange={(e) => onSaltChange(e.target.value)}/>
          </div>

          <MoveSelector onMoveSelect={setMove} selectedMove={yourMove}/>

          <div className={'flex flex-row justify-center'}>
            <Button onClick={solve}>Solve</Button>
          </div>

        </>
      )
    }

    if (currentUser === gameData.player2) {
      return <Button onClick={claimTimeout}>Claim timeout</Button>
    }

    return <p>Not your game</p>
  }

  const onSaltChange = (salt: string) => {
    console.log(salt);
  }

  const setMove = (move: number) => {
    console.log(move);
  }

  const timeLeft = gameData.timeout - (Math.floor(Date.now() / 1000) - gameData.lastAction);

  return (
    <>
      <div className={'flex flex-row justify-center'}>
        <h2 className={'text-2xl text-center'}>
          Your move: {yourMove}
        </h2>
        <h2 className={'text-2xl text-center'}>
          Your salt: {yourSalt.toString()}
        </h2>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Game Information</h2>

        <div className="flex flex-wrap -mx-2">
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-gray-600">Player 1</label>
            <span className="text-gray-800">{gameData.player1}</span>
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-gray-600">Player 2</label>
            <span className="text-gray-800">{gameData.player2}</span>
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-gray-600">C1 Hash</label>
            <span className="text-gray-800">{gameData.c1Hash}</span>
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-gray-600">C2 Move</label>
            <span className="text-gray-800">{gameData.c2Move}</span>
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-gray-600">Stake</label>
            <span className="text-gray-800">{gameData.stake} ETH</span>
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-gray-600">Last Action</label>
            <span className="text-gray-800">{new Date(gameData.lastAction * 1000).toLocaleString()}</span>
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-gray-600">Time left to solve</label>
            <span className="text-gray-800"><Countdown timeLeft={timeLeft}/></span>
          </div>
        </div>
      </div>

      {renderActions()}
    </>
  )
}


export default SolveGame
