import {ContractRunner, BigNumberish, Contract, ethers} from 'ethers';
import {GameInfo} from "../types/gameInfo.ts";
import {infuraKey, RPS_CONTRACT} from "../config.ts";

export class RpsFactory {

  static getReadOnlyContract(address: string): Promise<Rps> {
    const provider = new ethers.JsonRpcProvider(infuraKey);
    return Promise.resolve(new Rps(address, RPS_CONTRACT.abi, provider));
  }

  static async getReadWriteContract(address: string): Promise<Rps> {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Rps(address, RPS_CONTRACT.abi, signer);
  }

}

export class Rps {
  private readonly contract: Contract;

  constructor(public readonly contractAddress: string, abi: any[], provider: ContractRunner) {
    this.contract = new ethers.Contract(contractAddress, abi, provider);
  }

  public async GetGameInfo(): Promise<GameInfo> {
    const j1 = await this.contract.j1();
    const j2 = await this.contract.j2();
    const c1Hash = await this.contract.c1Hash();
    const c2 = await this.contract.c2();
    const stake = await this.contract.stake();
    const timeout = await this.contract.TIMEOUT();
    const lastAction = await this.contract.lastAction();

    return {
      player1: j1,
      player2: j2,
      c1Hash: c1Hash,
      c2Move: Number(c2),
      stake: ethers.formatEther(stake),
      timeout: Number(timeout),
      lastAction: Number(lastAction),
    };
  }

  public async Solve(move: number, salt: BigNumberish): Promise<void> {
    const tx = await this.contract.solve(move, salt);
    await tx.wait();
  }

  public async JoinGame(move: number, stake: BigNumberish): Promise<void> {
    const tx = await this.contract.play(move, {value: stake});
    await tx.wait();
  }

  public async TimeOutForPlayer1(): Promise<void> {
    const tx = await this.contract.j1Timeout();
    await tx.wait();
  }

  public async TimeOutForPlayer2(): Promise<void> {
    const tx = await this.contract.j2Timeout();
    await tx.wait();
  }


}

