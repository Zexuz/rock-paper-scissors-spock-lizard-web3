import Deploy from "./Components/Deploy.tsx";
import PlayMove from "./Components/PlayMove.tsx";
import {Outlet, Route, Routes} from "react-router-dom";
import SolveGame from "./Components/SolveGame.tsx";


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Deploy/>}/>
          <Route path="play/:contractAddress" element={<PlayMove/>}/>
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
