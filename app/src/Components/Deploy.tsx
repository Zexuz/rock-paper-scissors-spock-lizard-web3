import {ethers} from "ethers";
import {RPS_CONTRACT} from "../config.ts";
import MoveSelector from "./MoveSelector.tsx";

function DeployContract() {

  const onMoveSelect = (move: string) => {
    console.log(move)
  }

  const onSalt = (salt: string) => {
    console.log(salt)
  }

  const onOpponent = (opponent: string) => {
    console.log(opponent)
  }

  const deploy = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask")
      return
    }

    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner();

    const contractFactory = new ethers.ContractFactory(RPS_CONTRACT.abi, RPS_CONTRACT.bytecode, signer);

    const move = "Rock"
    const salt = "123"
    const opponent = "0x80F8696E0719570341F978e86Fc16A7D338353DF"
    const hash = ethers.solidityPackedKeccak256(["string", "string"], [move, salt])
    console.log(`Hash: ${hash}`)

    const contract = await contractFactory.deploy(hash, opponent);
    console.log(`Deployed contract at ${contract.target}`)
  }

  return (
    <>
      <h1 className={'text-4xl text-center'}>
        Rock Paper Scissors Lizard Spock
      </h1>

      <MoveSelector onMoveSelect={onMoveSelect}/>

      <div className={'flex flex-row justify-center'}>
        <input className={'border-2 border-gray-500 rounded-lg p-2 m-2'} type="text" placeholder={'Enter salt'}
               onChange={(e) => onSalt(e.target.value)}/>
      </div>
      <div className={'flex flex-row justify-center'}>
        <input className={'border-2 border-gray-500 rounded-lg p-2 m-2'} type="text"
               placeholder={'Enter opponent address'}
               onChange={(e) => onOpponent(e.target.value)}/>
      </div>

      <div className={'flex flex-row justify-center'}>
        <button className={'border-2 border-gray-500 rounded-lg p-2 m-2'} onClick={deploy}>DEPLOY</button>
      </div>
    </>
  )
}

export default DeployContract
