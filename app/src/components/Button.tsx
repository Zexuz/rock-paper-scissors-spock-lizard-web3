interface ButtonProps {
  disabled?: boolean,
  onClick: () => void
  children?: React.ReactNode
}

export const Button = ({disabled, onClick, children}: ButtonProps) => {

  return (
    <button
      className={`bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform ${!disabled ? 'hover:bg-blue-600 hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
};
