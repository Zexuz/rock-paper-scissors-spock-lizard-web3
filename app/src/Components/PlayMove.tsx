import {ethers} from "ethers";
import MoveSelector from "./MoveSelector.tsx";
import {RPS_CONTRACT} from "../config.ts";


interface GameInfo {
  player1: string,
  player2: string,
  contractAddress: string,
  stake: string,
}

function PlayMove() {

  const onClick = async () => {
    const contractAddress = localStorage.getItem('contractAddress') as string
    const abi = RPS_CONTRACT.abi;
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);

    const move = 1 // ROCK

    const tx = await contract.play(move, {value: ethers.parseEther("0.1")});
    console.log(`Transaction hash: ${tx.hash}`);
  }


  return (
    <>
      <h1 className={'text-4xl text-center'}>
        Rock Paper Scissors Lizard Spock
      </h1>

      <MoveSelector onMoveSelect={() => {
      }}/>

      <div className={'flex flex-row justify-center'}>
        <button className={'border-2 border-gray-500 rounded-lg p-2 m-2'} onClick={onClick}>Commit move</button>
      </div>
    </>
  )
}

export default PlayMove
