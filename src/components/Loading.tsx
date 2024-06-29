import React from "react";
import { CgSpinner } from "react-icons/cg";

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 z-[1000]">
            <div className="rounded-2xl relative flex flex-col items-center justify-center gap-2 text-white">
                <CgSpinner className="animate-spin h-12 w-12 text-white" />
                {/* <p className="font-semibold text-xl">Please wait...</p> */}
            </div>
        </div>
    );
};

export default Loading;
