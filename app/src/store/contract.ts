import {GameInfo} from "../types/gameInfo.ts";
import {create} from 'zustand'
import {BigNumberish, ethers} from 'ethers';
import {RPS_CONTRACT} from "../config.ts";

interface ContractStore {
  contractAddress: string | null;
  setContractAddress: (contractAddress: string) => void;
  currentUser: string | null;
  provider: ethers.AbstractProvider | null;
  signer: ethers.JsonRpcSigner | null;
  gameInfo: GameInfo | null;
  reloadGameInfo: () => Promise<void>;
  timeOutForPlayer: (player: number) => Promise<void>;
  solve: (move: number, salt: BigNumberish) => Promise<void>;
  play: (move: number, value: BigNumberish) => Promise<void>;
  deployContract: (info: DeployContractParams) => Promise<string>;
  initialize: () => Promise<void>;
}


interface DeployContractParams {
  move: number,
  salt: number,
  opponent: string,
  value: BigNumberish,
}

const useContractStore = create<ContractStore>((set, get) => ({
    contractAddress: null,
    setContractAddress: (contractAddress) => set({contractAddress}),
    currentUser: null,
    provider: null,
    signer: null,
    gameInfo: null,
    timeOutForPlayer: async (player) => {
      const signer = get().signer;

      if (!signer) {
        console.error("Signer not set!");
        return;
      }

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
      const signer = get().signer;

      if (!signer) {
        console.error("Signer not set!");
        return;
      }

      const contractWithSigner = new ethers.Contract(get().contractAddress!, RPS_CONTRACT.abi, signer);

      const tx = await contractWithSigner.play(move, {value: value});
      await tx.wait();
    },
    solve: async (move, salt) => {
      const signer = get().signer;

      if (!signer) {
        console.error("Signer not set!");
        return;
      }

      const contractWithSigner = new ethers.Contract(get().contractAddress!, RPS_CONTRACT.abi, signer);

      const tx = await contractWithSigner.solve(move, salt);
      await tx.wait();

    },
    deployContract: async (info: DeployContractParams): Promise<string> => {
      const signer = get().signer;

      if (!signer) {
        console.error("Signer not set!");
        return '';
      }

      const contractFactory = new ethers.ContractFactory(RPS_CONTRACT.abi, RPS_CONTRACT.bytecode, signer);

      const hash = ethers.solidityPackedKeccak256(["uint8", "uint256"], [info.move, info.salt])

      const contract = await contractFactory.deploy(hash, info.opponent, {
        value: info.value,
      });

      return contract.target.toString();
    },
    reloadGameInfo: async () => {
      const provider = get().provider!;
      const contractAddress = get().contractAddress!;

      const contract = new ethers.Contract(contractAddress, RPS_CONTRACT.abi, provider);

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
    initialize: async () => {
      if (get().provider != null) {
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      set({provider});

      if (get().signer != null) {
        return;
      }

      const signer = await provider.getSigner();
      set({signer});

      const user = await signer.getAddress();
      set({currentUser: user});
    }
  }
));

export default useContractStore;
