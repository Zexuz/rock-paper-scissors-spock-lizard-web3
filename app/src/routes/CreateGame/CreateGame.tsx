import {useState} from "react";
import useContractStore from "../../store/contract.ts";
import {useNavigate} from "react-router-dom";
import {loadGame, saveGame} from "../../lib/storage.ts";
import {Button} from "../../components/Button.tsx";
import GameInputForm, {FormState} from "./components/GameInputForm";

function CreateGame() {
  const [contractAddress, setContractAddress] = useState<string | null>(null)
  const [hasDeployed, setHasDeployed] = useState(false)
  const navigate = useNavigate()
  const lastGame = loadGame();

  const {deployContract} = useContractStore();

  const onFormSubmit = async ({salt, value, opponent, move}: FormState) => {
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


  return (
    <>
      <GameInputForm onFormSubmit={onFormSubmit} hasDeployed={hasDeployed}/>

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
