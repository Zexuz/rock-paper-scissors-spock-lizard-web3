import {BigNumberish, ethers} from "ethers";
import {useState} from "react";
import useContractStore from "../../store/contract.ts";
import {useNavigate} from "react-router-dom";
import {loadGame, saveGame} from "../../lib/storage.ts";
import MoveSelector from "../../components/MoveSelector.tsx";
import {Button} from "../../components/Button.tsx";
import {generateSecureRandomSalt} from "../../lib/utils.ts";
import Input from "../../components/Input.tsx";

function CreateGame() {
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const [hasDeployed, setHasDeployed] = useState(false)
  const [salt, setSalt] = useState(generateSecureRandomSalt())
  const [move, setMove] = useState(0)
  const [opponent, setOpponent] = useState("")
  const [value, setValue] = useState<BigNumberish>(0)
  const navigate = useNavigate()
  const lastGame = loadGame();

  const {deployContract} = useContractStore();

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
    saveGame({
      salt,
      move,
      contractAddress
    });
  };

  const navigateToNextPage = () => {
    navigate(`/play/${contractAddress}`)
  }

  const navigateToLastGame = () => {
    navigate(`/play/${lastGame?.contractAddress}`)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.href}play/${contractAddress}`);
  }

  const isValid = move > 0 && salt > 0 && opponent.length > 0;

  return (
    <>
      <div className={'flex flex-row justify-center'}>
        <p>Secure salt: {salt}</p>
      </div>
      <div className={'flex flex-row justify-center'}>
        <Input
          type="number"
          placeholder={'Enter custom salt to override, must be a number'}
          onChange={onSalt}/>
      </div>

      <div className={'flex flex-row justify-center'}>
        <Input
          type="text"
          placeholder={'Enter amount of ETH to wager, 0.01 ETH'}
          onChange={onVal}/>
      </div>

      <div className={'flex flex-row justify-center'}>
        <Input
          type="text"
          placeholder={'Enter opponent address'}
          onChange={onOpponent}/>
      </div>

      <MoveSelector onMoveSelect={onMoveSelect} selectedMove={move}/>

      {!hasDeployed && (
        <div className={'flex flex-row justify-center'}>
          <Button onClick={deploy} disabled={!isValid}>DEPLOY</Button>
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
              onClick={copyToClipboard}
              className="text-blue-600 hover:text-blue-800"
            >
              <p>Copy</p>
            </button>
          </div>
        </div>
      )}

      {lastGame && (
        <div className={'flex flex-row justify-center py-8'}>
          <Button onClick={navigateToLastGame}>Click here to go to last game {lastGame.contractAddress}</Button>
        </div>
      )}

      {!lastGame && (
        <div className={'flex flex-row justify-center py-8'}>
          <p>You have no saved game</p>
        </div>
      )}

    </>
  )
}

export default CreateGame
