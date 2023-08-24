import {ethers} from "ethers";
import MoveSelector from "./MoveSelector.tsx";
import {useEffect, useState} from "react";
import useMoveStore from "../store/move.ts";
import {Button} from "./Button.tsx";
import useContractStore from "../store/contract.ts";
import {useNavigate} from 'react-router-dom'

function DeployContract() {
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const {setMove, createSecureRandomSalt, salt, setSalt, setOpponent, isValid, setValue, opponent, move, value} = useMoveStore();
  const {deployContract, initialize} = useContractStore();
  const [hasDeployed, setHasDeployed] = useState(false)
  const navigate = useNavigate()


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
    setHasDeployed(true)
  };

  const navigateToNextPage = () => {
    navigate(`/play/${contractAddress}`)
  }

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

      {!hasDeployed && (
        <div className={'flex flex-row justify-center'}>
          <Button onClick={deploy} disabled={!isValid()}>DEPLOY</Button>
        </div>
      )}

      {hasDeployed && (
        <div className={'flex flex-row justify-center'}>
          <Button onClick={navigateToNextPage}>Click here to go to next page</Button>
        </div>
      )}

      {contractAddress && (
        <div className="flex flex-col items-center space-y-4 py-8">
          <p className="text-lg font-semibold text-gray-700">OR</p>
          <p className="text-lg font-semibold text-gray-700">Send this link to the opponent:</p>
          <div className="flex items-center space-x-2">
            <p className="text-md text-blue-600 font-mono bg-gray-100 p-2 rounded-lg">
              {`${window.location.href}play/${contractAddress}`}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.href}play/${contractAddress}`);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <p>Copy</p>
            </button>
          </div>
        </div>
      )}

    </>
  )
}

export default DeployContract
