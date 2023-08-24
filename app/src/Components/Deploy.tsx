import {ethers} from "ethers";
import MoveSelector from "./MoveSelector.tsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import useMoveStore from "../store/move.ts";
import {Button} from "./Button.tsx";
import useContractStore from "../store/contract.ts";

function DeployContract() {
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const {setMove, createSecureRandomSalt, salt, setSalt, setOpponent, isValid, setValue, opponent, move, value} = useMoveStore();
  const {deployContract, initialize} = useContractStore();


  useEffect(() => {
    (async () => {
      createSecureRandomSalt()
      await initialize()
    })()
  }, []);

  const onMoveSelect = (move: number) => {
    setMove(move)
  }

  const onSalt = (salt: string) => {
    const saltNumber = Number(salt)
    if (isNaN(saltNumber)) {
      console.error("Salt is not a number")
      return;
    }

    setSalt(saltNumber)
  }

  const onOpponent = (opponent: string) => {
    setOpponent(opponent)
  }

  const onVal = (val: string) => {
    const ethVal = ethers.parseEther(val)
    setValue(ethVal)
  }

  const deploy = async () => {

    const contractAddress = await deployContract({
      salt,
      move,
      opponent,
      value,
    })

    setContractAddress(contractAddress)

    if (!window.ethereum) {
      alert("Please install MetaMask")
      return
    }
  };

  return (
    <>
      <div className={'flex flex-row justify-center'}>
        <p>Secure salt: {salt}</p>
      </div>
      <div className={'flex flex-row justify-center'}>
        <input className={'border-2 border-gray-500 rounded-lg p-2 m-2 w-1/3'}
               type="number"
               placeholder={'Enter custom salt to override, must be a number'}
               onChange={(e) => onSalt(e.target.value)}/>
      </div>

      <div className={'flex flex-row justify-center'}>
        <input className={'border-2 border-gray-500 rounded-lg p-2 m-2 w-1/3'}
               type="text"
               placeholder={'Enter amount of ETH to wager, 0.01 ETH'}
               onChange={(e) => onVal(e.target.value)}/>
      </div>

      <div className={'flex flex-row justify-center'}>
        <input className={'border-2 border-gray-500 rounded-lg p-2 m-2 w-1/3'}
               type="text"
               placeholder={'Enter opponent address'}
               onChange={(e) => onOpponent(e.target.value)}/>
      </div>

      <MoveSelector onMoveSelect={onMoveSelect} selectedMove={move}/>

      <div className={'flex flex-row justify-center'}>
        <Button onClick={deploy} disabled={!isValid()}>DEPLOY</Button>
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
