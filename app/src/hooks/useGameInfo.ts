import {useState, useEffect} from 'react';
import {ethers} from 'ethers';
import {RPS_CONTRACT} from "../config.ts";
import {GameInfo} from "../types/gameInfo.ts";

const useContractData = (contractAddress?: string) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

  useEffect(() => {
    (async () => {
      if (!contractAddress) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const user = await signer.getAddress();
      setCurrentUser(user);

      const contract = new ethers.Contract(contractAddress, RPS_CONTRACT.abi, provider);

      const j1 = await contract.j1();
      const j2 = await contract.j2();
      const c1Hash = await contract.c1Hash();
      const c2 = await contract.c2();
      const stake = await contract.stake();
      const timeout = await contract.TIMEOUT();
      const lastAction = await contract.lastAction();

      console.log(j1, j2, c1Hash, stake, timeout, lastAction);

      setGameInfo({
        player1: j1,
        player2: j2,
        c1Hash: c1Hash,
        c2Move: Number(c2),
        stake: ethers.formatEther(stake),
        timeout: Number(timeout),
        lastAction: Number(lastAction),
      });
    })();
  }, [contractAddress]);

  return {currentUser, gameInfo};
};

export default useContractData;
