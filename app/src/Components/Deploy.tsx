import {ethers} from "ethers";
import {RPS_CONTRACT} from "../config.ts";
import MoveSelector from "./MoveSelector.tsx";
import {useState} from "react";
import {Link} from "react-router-dom";

function DeployContract() {
  const [contractAddress, setContractAddress] = useState<string | null>(null)

  const onMoveSelect = (move: number) => {
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

    const move = 2 // PAPER
    const salt = ethers.toBigInt("123")
    const opponent = "0x03c29bB357384623f33001418d7aD41E1f3f22B5"
    const hash = ethers.solidityPackedKeccak256(["uint8", "uint256"], [move, salt])
    console.log(`Hash: ${hash}`)

    const contract = await contractFactory.deploy(hash, opponent,{
      value: ethers.parseEther("0.1")
    });
    console.log(`Deployed contract at ${contract.target}`);

    localStorage.setItem('contractAddress', contract.target.toString())
    localStorage.setItem('salt', salt.toString())
    localStorage.setItem('move', move.toString())
    localStorage.setItem('hash', hash.toString())
    setContractAddress(contract.target.toString());
  }

  return (
    <>
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

      {contractAddress && (
        <div className={'flex flex-row justify-center'}>
          <Link to={`/play/${contractAddress}`}>
            <p>{`${window.location.href}play/${contractAddress}`}</p>
          </Link>
        </div>
      )}
    </>
  )
}

export default DeployContract
