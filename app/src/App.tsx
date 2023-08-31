import Deploy from "./routes/CreateGame/CreateGame.tsx";
import SecondPlayer from "./routes/SecondPlayer/SecondPlayer.tsx";
import {Outlet, Route, Routes} from "react-router-dom";
import SolveGame from "./routes/SolveGame/SolveGame.tsx";
import {useDispatch, useSelector} from "react-redux";
import {initializeProvider, initializeSigner} from './store/web3Slice';
import {useEffect} from "react";
import {AppDispatch, RootState} from "./store/store";
import {ethers} from "ethers";
import {SnackBar} from "./components/SnackBar";


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const provider = useSelector((state: RootState) => state.web3.provider);
  const signer = useSelector((state: RootState) => state.web3.signer);
  const readOnlyMode = useSelector((state: RootState) => state.web3.readOnlyMode);

  useEffect(() => {
    if (!provider) {
      console.log('initializing provider')
      dispatch(initializeProvider());
    }
    if (provider && !readOnlyMode && !signer) {
      console.log('initializing signer')
      dispatch(initializeSigner(provider as ethers.BrowserProvider));
    }
  }, [provider, readOnlyMode, signer, dispatch]);

  return (
    <>
      <SnackBar />
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Deploy/>}/>
          <Route path="play/:contractAddress" element={<SecondPlayer/>}/>
          <Route path="play/:contractAddress/solve" element={<SolveGame/>}/>
          <Route path="*" element={<NoMatch/>}/>
        </Route>
      </Routes>
    </>
  )
}

function Layout() {
  return (
    <div>
      <h1 className={'text-4xl text-center'}>
        Rock Paper Scissors Lizard Spock
      </h1>

      <Outlet/>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h1>404</h1>
    </div>
  );
}

export default App
