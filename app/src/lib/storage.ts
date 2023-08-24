interface Game {
  contractAddress: string;
  move: number;
  salt: number;
}

export const saveGame = (game: Game) => {
  localStorage.setItem('game', JSON.stringify(game));
}

export const loadGame = (): Game | null => {
  const game = localStorage.getItem('game');
  if (game) {
    return JSON.parse(game);
  }
  return null;
}
