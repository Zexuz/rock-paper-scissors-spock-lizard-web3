import {useMemo, useState} from 'react';
import {BigNumberish, ethers} from "ethers";
import {generateSecureRandomSalt} from "../../../lib/utils";
import Input from "../../../components/Input";
import MoveSelector from "../../../components/MoveSelector";
import {Button} from "../../../components/Button";


export interface FormState {
  salt: number;
  move: number;
  opponent: string;
  value: BigNumberish;
}

interface GameInputFormProps {
  onFormSubmit: (formState: FormState) => void;
  hasDeployed: boolean;
}

const GameInputForm = ({onFormSubmit, hasDeployed}: GameInputFormProps) => {
  const [salt, setSalt] = useState(generateSecureRandomSalt());
  const [move, setMove] = useState(0);
  const [opponent, setOpponent] = useState("");
  const [value, setValue] = useState<BigNumberish>(0);

  const isValid = useMemo(() => validateInput(move, salt, opponent), [move, salt, opponent]);

  const onSaltChange = (salt: string) => {
    const saltNumber = Number(salt);
    if (isNaN(saltNumber)) {
      console.error("Salt is not a number");
      return;
    }
    setSalt(saltNumber);
  };

  const onValueChange = (val: string) => {
    const ethVal = ethers.parseEther(val);
    setValue(ethVal);
  };

  const handleSubmit = () => {
    if (isValid) {
      onFormSubmit({salt, move, opponent, value});
    }
  };


  return (
    <>
      <div className={'flex flex-row justify-center'}>
        <Input
          type="number"
          placeholder={'Enter custom salt to override, must be a number'}
          onChange={onSaltChange}
        />
      </div>

      <div className={'flex flex-row justify-center'}>
        <Input
          type="text"
          placeholder={'Enter amount of ETH to wager, 0.01 ETH'}
          onChange={onValueChange}
        />
      </div>

      <div className={'flex flex-row justify-center'}>
        <Input
          type="text"
          placeholder={'Enter opponent address'}
          onChange={setOpponent}
        />
      </div>

      <MoveSelector onMoveSelect={setMove} selectedMove={move}/>

      {!hasDeployed && (
        <div className={'flex flex-row justify-center'}>
          <Button onClick={handleSubmit} disabled={!isValid}>D</Button>
        </div>
      )}
    </>
  );
};

const validateInput = (move: number, salt: number, opponent: string) => {
  return move > 0 && salt > 0 && opponent.length > 0;
};

export default GameInputForm;
