interface MoveSelectorProps {
  onMoveSelect: (move: number) => void;
  selectedMove?: number;
}

export const MoveSelector = ({onMoveSelect, selectedMove}: MoveSelectorProps) => {
  const moves: { [key: string]: number } = {
    "Rock": 1,
    "Paper": 2,
    "Scissors": 3,
    "Spock": 4,
    "Lizard": 5
  };

  const handleMoveSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMoveSelect(moves[e.target.value]);
  };

  return (
    <div className={'flex flex-row justify-center'}>
      {Object.keys(moves).map((move, index) => (
        <div className={'flex flex-col items-center m-4'} key={index}>
          <input
            type="radio"
            id={move}
            name="move"
            value={move}
            onChange={handleMoveSelect}
            checked={selectedMove === moves[move]}
          />
          <label htmlFor={move}>{move}</label>
        </div>
      ))}
    </div>
  );
}

export default MoveSelector;
