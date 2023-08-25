import {ChangeEvent} from 'react';

interface Props {
  onChange: (value: string) => void;
  type: string;
  placeholder: string;
}

const Input = ({onChange, type, placeholder}: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      className="border-2 border-gray-500 rounded-lg p-2 m-2 w-1/3"
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
    />
  );
};

export default Input;
