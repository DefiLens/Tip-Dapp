import React from "react";

const AuthLayout = ({ children }: any) => {
    return (
        <div className="flex h-screen">
            {/* Left side */}
            <div className="hidden md:flex w-1/2 p-8 flex-col justify-center items-center">
                <div className="p-5 rounded-3xl bg bg-opacity-15 bg-blur-lg text-gray-700 flex flex-col items-center gap-8 h-[90%] w-[90%] border border-W50">
                    <h1 className="text-5xl text-B0 font-bold text-start w-full">
                        {/* Empower web3 builders with your tips and support their groundbreaking contributions seamlessly
                        on our platform. */}
                        <span className="DM_Mono">
                            Social Tip
                            <br />
                            for
                            <br />
                            web3 builders
                        </span>
                    </h1>

                    <div className="flex flex-col w-full justify-center items-center gap-4">
                        <h2 className="text-xl text-B0 font-medium DM_Mono">How it Works? </h2>
                        <div className="flex items-center justify-center h-full gap-2 w-full relative">
                            <div className="flex flex-col gap-5">
                                <div className="flex gap-3 w-full">
                                    <div className="border border-W50 bg-B0 text-white rounded-full h-8 w-8 flex items-center justify-center">
                                        1
                                    </div>
                                    <div className="flex-1 border border-W50 bg-opacity-25 px-5 py-2 rounded-lg">
                                        <p>Connect Wallet</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full">
                                    <div className="border border-W50 bg-B0 text-white rounded-full h-8 w-8 flex items-center justify-center">
                                        2
                                    </div>

                                    <div className="flex-1 border border-W50 bg-opacity-25 px-5 py-2 rounded-lg">
                                        <p>Link with Farcaster</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full">
                                    <div className="border border-W50 bg-B0 text-white rounded-full h-8 w-8 flex items-center justify-center">
                                        3
                                    </div>
                                    <div className="flex-1 border border-W50 bg-opacity-25 px-5 py-2 rounded-lg">
                                        <p>Create session for easy tip</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full">
                                    <div className="border border-W50 bg-B0 text-white rounded-full h-8 w-8 flex items-center justify-center">
                                        4
                                    </div>
                                    <div className="flex-1 border border-W50 bg-opacity-25 px-5 py-2 rounded-lg">
                                        <p>Deposit USDC in your wallet</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full">
                                    <div className="border border-W50 bg-B0 text-white rounded-full h-8 w-8 flex items-center justify-center">
                                        5
                                    </div>
                                    <div className="flex-1 border border-W50 bg-opacity-25 px-5 py-2 rounded-lg">
                                        <p>Give tip to builders without sign</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col justify-center items-center">{children}</div>
        </div>
    );
};

export default AuthLayout;
