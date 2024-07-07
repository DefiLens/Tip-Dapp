import React from "react";

const AuthLayout = ({ children }: any) => {
    return (
        <div className="flex h-screen relative">
            {/* Left side */}
            <div className="hidden md:block absolute inset-0 md:w-1/2">
                <img src="https://cdn.pixabay.com/photo/2017/01/18/08/25/social-media-1989152_640.jpg" className="h-full w-full object-cover"/>
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            </div>
            <div className="z-10 hidden md:flex w-1/2 p-8 flex-col justify-center items-center">
                <div className="p-5 rounded-3xl bg-white bg-opacity-15 backdrop-blur-sm text-white flex flex-col items-center justify-center gap-8 h-[90%] w-[90%] border border-white">
                    <h1 className="text-5xl text-white w-full text-center font-semibold leading-snug">
                        Empower web3 builders with your tips and support their groundbreaking contributions seamlessly
                        on our platform.
                    </h1>
                </div>
            </div>

            {/* Right side */}
            <div className="w-full md:w-1/2 bg-gradient-to-t from-black to-W80 p-8 flex flex-col justify-center items-center">{children}</div>
        </div>
    );
};

export default AuthLayout;
