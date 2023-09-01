import {useCallback, useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import MoveSelector from '../../components/MoveSelector';
import Loading from '../../components/Loading';
import {AppDispatch, useAppSelector} from '../../store/store';
import {Button} from '../../components/Button';
import {Countdown} from '../../components/Countdown';
import {fetchGameInfo} from '../../store/RpsContractSlice';
import {getCurrentUser} from '../../store/web3Slice';
import {RpsFactory} from '../../lib/rps';
import {GameInfo} from '../../types/gameInfo';
import {usePerformAsyncAction} from "../../hooks/usePerformAsyncAction.ts";


function JoinGame() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const {contractAddress} = useParams<string>()
  const gameInfo: GameInfo = useAppSelector((state) => state.rpsContract.GameInfo);
  const loading: boolean = useAppSelector((state) => state.rpsContract.loading);
  const currentUser: string = useAppSelector((state) => state.web3.currentUser);
  const performAction = usePerformAsyncAction();

  useEffect(() => {
    dispatch(fetchGameInfo(contractAddress!));
    dispatch(getCurrentUser());
  }, [contractAddress]);

  const [move, setMove] = useState(gameInfo?.c2Move || 0);
  const [havePlayed, setHavePlayed] = useState(gameInfo?.c2Move !== 0);

  const onClick = () => performAction(async () => {
    await (await RpsFactory.getReadWriteContract(contractAddress!)).JoinGame(move, ethers.parseEther(gameInfo.stake))
    setHavePlayed(true);
  });

  const timeOut = () => performAction(async () => {
    await (await RpsFactory.getReadWriteContract(contractAddress!)).TimeOutForPlayer2()
  });

  const navigateToNextPage = () => {
    navigate(`/play/${contractAddress}/solve`)
  }

  const handleMoveSelect = useCallback((move: number) => {
    setMove(move);
  }, []);

  if (loading) return (<Loading/>)

  const {timeout, lastAction, player1, player2, stake, c2Move} = gameInfo;

  const timeLeft = timeout - (Math.floor(Date.now() / 1000) - lastAction);
  const canPlayer1Timeout = currentUser === player1 && timeLeft <= 0;
  const haveC2Moved = c2Move !== 0;

  console.log(`haveC2Moved ${haveC2Moved}, move === 0 ${move === 0}, havePlayed ${havePlayed}`);

  return (
    <>
      <div className="p-4 space-y-4">

        <h1 className="text-3xl font-semibold text-center text-blue-600">Opponents Move</h1>

        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-700">Player 1: {player1} vs Player
            2: {player2}</h2>
          <h2 className="text-lg text-gray-600">Stake: {stake} ETH</h2>
          <Countdown timeLeft={timeout - (Math.floor(Date.now() / 1000) - lastAction)}/>
        </div>

        <MoveSelector onMoveSelect={handleMoveSelect} selectedMove={move}/>

        {currentUser === player1 && (
          <div className={"flex justify-center space-x-8"}>
            <Button disabled={!canPlayer1Timeout} onClick={timeOut}>Timeout for Player 1</Button>
          </div>
        )}

        {currentUser === player2 && (
          <div className="text-center">
            <Button
              onClick={onClick}
              disabled={haveC2Moved || move === 0 || havePlayed}
            >
              Commit move
            </Button>
          </div>
        )}

        {(haveC2Moved || havePlayed) && (
          <div className={'flex flex-row justify-center'}>
            <Button onClick={navigateToNextPage}>Click here to go to next page</Button>
          </div>
        )}
      </div>
    </>
  )
}


export default JoinGame
