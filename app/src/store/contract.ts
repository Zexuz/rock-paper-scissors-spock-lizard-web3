import {GameInfo} from "../types/gameInfo.ts";
import {create} from 'zustand'
import {BigNumberish, ethers} from 'ethers';
import {RPS_CONTRACT} from "../config.ts";

interface ContractStore {
  contractAddress: string | null;
  setContractAddress: (contractAddress: string) => void;
  currentUser: string | null;
  getCurrentUser: () => Promise<void>;
  gameInfo: GameInfo | null;
  reloadGameInfo: () => Promise<void>;
  timeOutForPlayer: (player: number) => Promise<void>;
  solve: (move: number, salt: BigNumberish) => Promise<void>;
  play: (move: number, value: BigNumberish) => Promise<void>;
}


const useContractStore = create<ContractStore>((set, get) => ({
    contractAddress: null,
    currentUser: null,
    setContractAddress: (contractAddress) => set({contractAddress}),
    getCurrentUser: async () => {
      const provider = getProvider();
      const signer = await provider.getSigner();

      set({currentUser: await signer.getAddress()});
    },
    gameInfo: null,
    timeOutForPlayer: async (player) => {
      const signer = await getSigner();
      const contractWithSigner = new ethers.Contract(get().contractAddress!, RPS_CONTRACT.abi, signer);

      if (player === 1) {
        const tx = await contractWithSigner.j1Timeout();
        await tx.wait();
        return;
      }

      else if (player === 2) {
        const tx = await contractWithSigner.j2Timeout();
        await tx.wait();
        return;
      }

      console.error("Invalid player")
    },
    play: async (move, value) => {
      const contractWithSigner = await getContract(get().contractAddress!);

      const tx = await contractWithSigner.play(move, {value: value});
      await tx.wait();
    },
    solve: async (move, salt) => {
      const contractWithSigner = await getContract(get().contractAddress!);

      const tx = await contractWithSigner.solve(move, salt);
      await tx.wait();

    },
    reloadGameInfo: async () => {
      const contractAddress = get().contractAddress!;
      const contract = await getContract(contractAddress)

      const j1 = await contract.j1();
      const j2 = await contract.j2();
      const c1Hash = await contract.c1Hash();
      const c2 = await contract.c2();
      const stake = await contract.stake();
      const timeout = await contract.TIMEOUT();
      const lastAction = await contract.lastAction();

      const gameInfo: GameInfo = {
        player1: j1,
        player2: j2,
        c1Hash: c1Hash,
        c2Move: Number(c2),
        stake: ethers.formatEther(stake),
        timeout: Number(timeout),
        lastAction: Number(lastAction),
      }

      set({gameInfo});
    },
  }
));

// TODO: Handle use case where the user does not have metamask installed (custom JSON RPC)
const getProvider = () => {
  return new ethers.BrowserProvider(window.ethereum);
}

const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
}

const getContract = async (address: string) => {
  if (window.ethereum === undefined) {
    return await getReadOnlyContract(address);
  }

  return await getWriteContract(address);
}

const getReadOnlyContract = async (address: string) => {
  const provider = getProvider();
  return new ethers.Contract(address, RPS_CONTRACT.abi, provider);
}

const getWriteContract = async (address: string) => {
  const signer = await getSigner();
  return new ethers.Contract(address, RPS_CONTRACT.abi, signer);
}

export default useContractStore;
