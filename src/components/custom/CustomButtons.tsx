const CustomButton = ({ onClick, disabled, children }: any) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="bg-sky-500 hover:bg-sky-700 text-white px-4 py-2 rounded transition-all duration-300"
        >
            {children}
        </button>
    );
};

export default CustomButton;
