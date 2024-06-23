const CustomButton = ({ onClick, disabled, children }: any) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
        >
            {children}
        </button>
    );
};

export default CustomButton;
