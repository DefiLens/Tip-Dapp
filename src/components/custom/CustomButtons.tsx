import { CgSpinner } from "react-icons/cg";

const CustomButton = ({ onClick, disabled, isLoading, className, children }: any) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`bg-B0 hover:bg-B30 text-white text-sm px-4 py-2 rounded-lg transition-all duration-300 flex justify-center items-center ${className}`}
        >
            {isLoading && <CgSpinner className="animate-spin h-5 w-5" />}
            {!isLoading && children}
        </button>
    );
};

export default CustomButton;
