interface MoveSelectorProps {
  onMoveSelect: (move: number) => void
}

export const MoveSelector = ({onMoveSelect}: MoveSelectorProps) => {
  const moves: { [key: string]: number } = {
    "Rock": 1,
    "Paper": 2,
    "Scissors": 3,
    "Spock": 4,
    "Lizard": 5
  };


  return (
    <>
      <div className={'flex flex-row justify-center'}>
        {Object.keys(moves)
               .map((move, index) => (
                 <div className={'flex flex-col items-center m-4'} key={index}>
                   <input type="radio" id={move} name="move" value={move} onClick={() => onMoveSelect(moves[move])}/>
                   <label htmlFor={move}>{move}</label>
                 </div>
               ))}
      </div>
    </>
  )
}

export default MoveSelector
