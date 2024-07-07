import { CgSpinner } from "react-icons/cg";

const CustomButton = ({ onClick, disabled, isLoading, className, children }: any) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`bg-B0 hover:bg-B30 text-white text-sm px-4 py-2 rounded-lg transition-all duration-300 flex justify-center items-center ${disabled ? "bg-opacity-80 bg-B0": ""} ${className}`}
        >
            {isLoading && <CgSpinner className="animate-spin h-5 w-5 mx-auto mr-2" />}
            {children}
        </button>
    );
};

export default CustomButton;
