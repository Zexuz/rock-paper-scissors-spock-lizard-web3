interface GameInfoFieldProps {
  label: string;
  data: string | number | React.ReactNode;
}

export const GameInfoField = ({label, data}: GameInfoFieldProps) => (
  <div className="w-1/2 px-2 mb-4">
    <label className="block text-gray-600">{label}</label>
    <span className="text-gray-800">{data}</span>
  </div>
);
