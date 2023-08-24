import {create} from 'zustand'
import {BigNumberish} from "ethers";

interface Move {
  move: number,
  salt: number,
  loadSalt: () => void,
  opponent: string,
  value: BigNumberish,
  setValue: (value: BigNumberish) => void,
  setOpponent: (opponent: string) => void,
  setMove: (move: number) => void,
  setSalt: (salt: number) => void,
  createSecureRandomSalt: () => void,
  isValid: () => boolean,
}

const useMoveStore = create<Move>((set, get) => ({
    move: 0,
    salt: 0,
    opponent: "",
    value: 0,
    setValue: (value) => set({value}),
    setOpponent: (opponent) => set({opponent}),
    setMove: (move) => set({move}),
    loadSalt: () => {
      const salt = localStorage.getItem('salt')
      if (!salt) {
        console.error("Salt not set!")
        return
      }
      set({salt: parseInt(salt)})
    },
    setSalt: (salt) => {
      set({salt})
      localStorage.setItem('salt', salt.toString())
    },
    createSecureRandomSalt: () => {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const salt = array[0];
      set({salt});
    },
    isValid: () => {
      return get().move > 0 && get().salt > 0 && get().opponent.length > 0;
    }
  }
))
export default useMoveStore;



