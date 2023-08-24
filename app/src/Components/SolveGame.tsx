import {ethers} from "ethers";
import {RPS_CONTRACT} from "../config.ts";

function SolveGame() {

  const yourMove = Number(localStorage.getItem('move') as string);
  const yourSalt = ethers.toBigInt(localStorage.getItem('salt') as string);

  const solve = async () => {
    const contractAddress = localStorage.getItem('contractAddress') as string
    const abi = RPS_CONTRACT.abi;
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);


    const tx = await contract.solve(yourMove, yourSalt);
    console.log(`Transaction hash: ${tx.hash}`);
  }

  return (
    <>
      <h1 className={'text-4xl text-center'}>
        Rock Paper Scissors Lizard Spock
      </h1>

      <div className={'flex flex-row justify-center'}>
        <h2 className={'text-2xl text-center'}>
          Your move: {yourMove}
        </h2>
        <h2 className={'text-2xl text-center'}>
          Your salt: {yourSalt.toString()}
        </h2>
      </div>


      <div className={'flex flex-row justify-center'}>
        <button className={'border-2 border-gray-500 rounded-lg p-2 m-2'} onClick={solve}>Solve</button>
      </div>
    </>
  )
}

export default SolveGame
