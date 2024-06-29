// "use client";

// import CreateSessionButton from "@/components/CreateSession";
// import CustomButton from "@/components/custom/CustomButtons";
// import { DataState } from "@/context/dataProvider";
// import axiosInstance from "@/utils/axiosInstance";
// import { useLinkAccount, useLogin, usePrivy } from "@privy-io/react-auth";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// const Login: React.FC = () => {
//     const { createSmartAccount, isBiconomySession } = DataState();
//     const { ready, user: privyUser, authenticated } = usePrivy();
//     const [isWalletConnected, setIsWalletConnected] = useState(false);
//     const [isLinkedFarcaster, setIsLinkedFarcaster] = useState(false);
//     const [isSession, setIsSession] = useState(false);

//     const router = useRouter();

//     const { login } = useLogin({
//         onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
//             // console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount);

//             const address = await createSmartAccount();
//             const userData = {
//                 id: user.id,
//                 createdAt: user.createdAt,
//                 linkedAccounts: user.linkedAccounts,
//                 wallet: user.wallet,
//                 smartAccountAddress: address,
//             };

//             console.log(userData);
//         },
//         onError: (error) => {
//             console.log(error);
//         },
//     });

//     const { linkFarcaster } = useLinkAccount({
//         onSuccess: (user, linkMethod, linkedAccount) => {
//             console.log(user, linkMethod, linkedAccount);
//         },
//         onError: (error) => {
//             console.log(error);
//         },
//     });

//     const sendUserDataToBackend = async (data: any) => {
//         try {
//             const response = await axiosInstance.post("/user", data);
//             if (response.data.alreadyReg) {
//                 router.push("/");
//             }
//             setIsWalletConnected(true);
//         } catch (error) {
//             console.error("Error sending user data:", error);
//         }
//     };

//     const handleRedirectToDeposit = () => {
//         router.push("/deposit");
//     };

//     useEffect(() => {
//         if (authenticated) {
//             setIsWalletConnected(true);
//         }
//     }, [authenticated]);

//     useEffect(() => {
//         if (authenticated) {
//             setIsSession(isBiconomySession);
//         }
//     }, [authenticated]);

//     // useEffect(() => {
//     //     if (authenticated && privyUser) {
//     //         const farcasterAccount = privyUser.linkedAccounts.find((account) => account.type === "farcaster");
//     //         if (farcasterAccount) {
//     //             setIsLinkedFarcaster(true);
//     //         }
//     //     }
//     // }, [authenticated, privyUser]);

//     return (
//         <div className="flex h-screen bg-gray-100">
//             {/* Left side */}
//             <div className="hidden md:w-1/2 bg-gray-200 p-8 md:flex flex-col justify-center items-center">
//                 <div className="p-5 rounded-3xl bg-white bg-opacity-30 bg-blur-lg text-gray-700 flex flex-col items-center justify-center h-[90%] w-[90%] shadow-xl">
//                     <h2 className="text-6xl text-center font-bold mb-10 text-gray-800">Welcome to Base Chain DApp</h2>
//                     <p className="text-center text-lg mb-4 w-3/4 text-gray-700">
//                         Join our decentralized social platform where you can share posts, give tips, and earn USDC tips
//                         on your own content.
//                     </p>
//                     <p className="text-center text-lg w-3/4 text-gray-700">
//                         Experience the power of blockchain with secure and transparent transactions.
//                     </p>
//                 </div>
//             </div>

//             {/* Right side */}
//             <div className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col justify-center items-center">
//                 {!isWalletConnected ? (
//                     <div className="text-center flex flex-col items-center">
//                         <h2 className="text-3xl font-semibold mb-4 text-gray-800">
//                             Please connect your wallet
//                             <br /> to get started.
//                         </h2>
//                         <CustomButton onClick={login}>Connect Wallet</CustomButton>
//                         <div className="mt-8 text-sm text-gray-700">
//                             <p>
//                                 By connecting your wallet,
//                                 <br /> you agree to our Terms and Conditions.
//                             </p>
//                             <p>Protected by Privy.</p>
//                         </div>
//                     </div>
//                 ) : !isLinkedFarcaster ? (
//                     ready &&
//                     authenticated && (
//                         <div className="text-center flex flex-col items-center">
//                             <h2 className="text-3xl font-semibold mb-4 text-gray-800">
//                                 Please link with Farcaster
//                                 <br /> to proceed.
//                             </h2>
//                             <CustomButton onClick={linkFarcaster}>Link with Farcaster</CustomButton>
//                         </div>
//                     )
//                 ) : !isSession ? (
//                     <div className="text-center flex flex-col items-center">
//                         <h2 className="text-3xl font-semibold mb-4 text-gray-800">
//                             Create a session for a seamless
//                             <br /> payment experience
//                         </h2>
//                         <CreateSessionButton />
//                         <div className="mt-8 text-sm text-gray-700">
//                             <p>
//                                 After creating a session, your wallet will not need to be opened for sending
//                                 transactions.
//                                 <br /> We cover gas fees for you, making tipping in USDC effortless.
//                             </p>
//                             <p>Protected by Biconomy.</p>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="text-center flex flex-col items-center justify-center">
//                         <p className="mb-8 font-semibold text-2xl w-3/4 text-gray-800">
//                             Deposit USDC to your account to start using the platform.
//                         </p>
//                         <CustomButton onClick={handleRedirectToDeposit}>Deposit USDC</CustomButton>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Login;

// "use client";

// import CreateSessionButton from "@/components/CreateSession";
// import CustomButton from "@/components/custom/CustomButtons";
// import { DataState } from "@/context/dataProvider";
// import axiosInstance from "@/utils/axiosInstance";
// import { useLogin, useLinkAccount, usePrivy } from "@privy-io/react-auth";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// const Login: React.FC = () => {
//     const { createSmartAccount, isBiconomySession } = DataState();
//     const { ready, user: privyUser, authenticated } = usePrivy();
//     const [isWalletConnected, setIsWalletConnected] = useState(false);
//     const [isLinkedFarcaster, setIsLinkedFarcaster] = useState(false);
//     const [isSession, setIsSession] = useState(false);

//     const router = useRouter();

//     const { login } = useLogin({
//         onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
//             const address = await createSmartAccount();
//             const userData = {
//                 id: user.id,
//                 createdAt: user.createdAt,
//                 linkedAccounts: user.linkedAccounts,
//                 wallet: user.wallet,
//                 smartAccountAddress: address,
//             };

//             sendUserDataToBackend(userData);
//         },
//         onError: (error) => {
//             console.log(error);
//         },
//     });

//     const { linkFarcaster } = useLinkAccount({
//         onSuccess: async (user, linkMethod, linkedAccount) => {
//             const address = await createSmartAccount();
//             const userData = {
//                 id: user.id,
//                 createdAt: user.createdAt,
//                 linkedAccounts: user.linkedAccounts,
//                 wallet: user.wallet,
//                 smartAccountAddress: address,
//             };

//             sendUserDataToBackend(userData);
//         },
//         onError: (error) => {
//             console.log(error);
//         },
//     });

//     const sendUserDataToBackend = async (data: any) => {
//         try {
//             const response = await axiosInstance.post("/user", data);

//             if (response.data.alreadyReg) {
//                 router.push("/");
//             } else {
//                 setIsWalletConnected(true);
//             }
//         } catch (error) {
//             console.error("Error sending user data:", error);
//         }
//     };

//     const handleRedirectToDeposit = () => {
//         router.push("/deposit");
//     };

//     useEffect(() => {
//         if (authenticated) {
//             setIsSession(isBiconomySession);
//         }
//     }, [authenticated]);

//     useEffect(() => {
//         if (authenticated && privyUser) {
//             const farcasterAccount = privyUser.linkedAccounts.find((account) => account.type === "farcaster");
//             if (farcasterAccount) {
//                 setIsLinkedFarcaster(true);
//             }
//         }
//     }, [authenticated, privyUser]);

//     return (
//         <div className="flex h-screen bg-gray-100">
//             {/* Left side */}
//             <div className="w-1/2 bg-gray-200 p-8 flex flex-col justify-center items-center">
//                 <div className="p-5 rounded-3xl bg-white bg-opacity-30 bg-blur-lg text-gray-700 flex flex-col items-center justify-center h-[90%] w-[90%] shadow-xl">
//                     <h2 className="text-6xl text-center font-bold mb-10 text-gray-800">Welcome to Base Chain DApp</h2>
//                     <p className="text-center text-lg mb-4 w-3/4 text-gray-700">
//                         Join our decentralized social platform where you can share posts, give tips, and earn USDC tips
//                         on your own content.
//                     </p>
//                     <p className="text-center text-lg w-3/4 text-gray-700">
//                         Experience the power of blockchain with secure and transparent transactions.
//                     </p>
//                 </div>
//             </div>

//             {/* Right side */}
//             <div className="w-1/2 bg-gray-100 p-8 flex flex-col justify-center items-center">
//                 {!isWalletConnected ? (
//                     <div className="text-center flex flex-col items-center">
//                         <h2 className="text-3xl font-semibold mb-4 text-gray-800">
//                             Please connect your wallet
//                             <br /> to get started.
//                         </h2>
//                         <CustomButton onClick={login}>Connect Wallet</CustomButton>
//                         <div className="mt-8 text-sm text-gray-700">
//                             <p>
//                                 By connecting your wallet,
//                                 <br /> you agree to our Terms and Conditions.
//                             </p>
//                             <p>Protected by Privy.</p>
//                         </div>
//                     </div>
//                 ) : !isLinkedFarcaster ? (
//                     ready &&
//                     authenticated && (
//                         <div className="text-center flex flex-col items-center">
//                             <h2 className="text-3xl font-semibold mb-4 text-gray-800">
//                                 Please link with Farcaster
//                                 <br /> to proceed.
//                             </h2>
//                             <CustomButton onClick={linkFarcaster}>Link with Farcaster</CustomButton>
//                         </div>
//                     )
//                 ) : !isSession ? (
//                     <div className="text-center flex flex-col items-center">
//                         <h2 className="text-3xl font-semibold mb-4 text-gray-800">
//                             Create a session for a seamless
//                             <br /> payment experience
//                         </h2>
//                         <CreateSessionButton />
//                         <div className="mt-8 text-sm text-gray-700">
//                             <p>
//                                 After creating a session, your wallet will not need to be opened for sending
//                                 transactions.
//                                 <br /> We cover gas fees for you, making tipping in USDC effortless.
//                             </p>
//                             <p>Protected by Biconomy.</p>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="text-center flex flex-col items-center justify-center">
//                         <p className="mb-8 font-semibold text-2xl w-3/4 text-gray-800">
//                             Deposit USDC to your account to start using the platform.
//                         </p>
//                         <CustomButton onClick={handleRedirectToDeposit}>Deposit USDC</CustomButton>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Login;

"use client";

import CreateSessionButton from "@/components/CreateSession";
import CustomButton from "@/components/custom/CustomButtons";
import AuthLayout from "@/components/layouts/AuthLayout";
import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import { useLogin, useLinkAccount, usePrivy, useLogout } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Login: React.FC = () => {
    const { createSmartAccount, isBiconomySession } = DataState();
    const { ready, user: privyUser, authenticated } = usePrivy();
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isLinkedFarcaster, setIsLinkedFarcaster] = useState(false);
    const [isSession, setIsSession] = useState(false);

    const router = useRouter();

    // const { login } = useLogin({
    //     onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
    //         console.log(user)
    //         const address = await createSmartAccount();
    //         const userData = {
    //             id: user.id,
    //             createdAt: user.createdAt,
    //             linkedAccounts: user.linkedAccounts,
    //             wallet: user.wallet,
    //             smartAccountAddress: address,
    //         };

    //         sendUserDataToBackend(userData);
    //     },
    //     onError: (error) => {
    //         console.log(error);
    //     },
    // });

    // const { linkFarcaster } = useLinkAccount({
    //     onSuccess: async (user, linkMethod, linkedAccount) => {
    //         console.log("farcaster", user);
    //         // console.log("linkedAccount", linkedAccount);
    //         // console.log("linkMethod", linkMethod);
    //         linkFarcasterApi(user);
    //     },
    //     // onError: (error) => {
    //     //     console.log(error);
    //     // },
    // });

    // const sendUserDataToBackend = async (data: any) => {
    //     try {
    //         const response = await axiosInstance.post("/user", data);

    //         if (response.data.alreadyReg) {
    //             router.push("/");
    //         } else {
    //             setIsWalletConnected(true);
    //         }
    //     } catch (error) {
    //         console.error("Error sending user data:", error);
    //     }
    // };

    // const linkFarcasterApi = async (data: any) => {
    //     try {
    //         const response = await axiosInstance.post("/link-farcaster", data);

    //         // if (response.data.alreadyReg) {
    //         //     router.push("/");
    //         // } else {
    //         //     setIsWalletConnected(true);
    //         // }
    //     } catch (error) {
    //         console.error("Error sending user data:", error);
    //     }
    // };

    const { login } = useLogin({
        onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
            console.log("Login: ",user)

            const address = await createSmartAccount();
            const userData = {
                id: user.id,
                createdAt: user.createdAt,
                linkedAccounts: user.linkedAccounts,
                wallet: user.wallet,
                smartAccountAddress: address,
            };

            sendUserDataToBackend(userData);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const { linkFarcaster } = useLinkAccount({
        onSuccess: async (user, linkMethod, linkedAccount) => {
            console.log("Farcaster: ",user)
            linkFarcasterApi(user);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const sendUserDataToBackend = async (data: any) => {
        try {
            const response = await axiosInstance.post("/user", data);

            if (response.data.alreadyReg) {
                router.push("/");
            } else {
                setIsWalletConnected(true);
            }
        } catch (error) {
            console.error("Error sending user data:", error);
        }
    };

    const linkFarcasterApi = async (data: any) => {
        try {
            await axiosInstance.post("/user/link-farcaster", {farcasterAccount: data});
            setIsLinkedFarcaster(true);
            router.push("/");
        } catch (error) {
            console.error("Error sending user data:", error);
        }
    };

    useEffect(() => {
        if (authenticated && privyUser) {
            const farcasterAccount = privyUser.linkedAccounts.find((account) => account.type === "farcaster");
            if (farcasterAccount) {
                setIsLinkedFarcaster(true);
            }
        }
    }, [authenticated, privyUser]);

    const handleRedirectToDeposit = () => {
        router.push("/deposit");
    };

    useEffect(() => {
        if (authenticated && privyUser) {
            const farcasterAccount = privyUser.linkedAccounts.find((account) => account.type === "farcaster");
            if (farcasterAccount) {
                setIsLinkedFarcaster(true);
            }
        }
    }, [authenticated, privyUser]);

    return (
        <AuthLayout>
            <div className="text-center flex flex-col items-center justify-center relative h-full DM_Mono">
                {!isWalletConnected ? (
                    <div className="text-center flex flex-col items-center">
                        <h2 className="text-3xl font-semibold mb-8 text-gray-800 ">Login using your wallet</h2>
                        <button
                            onClick={login}
                            className="bg-B0 hover:bg-B10 text-white text-xl font-medium py-3 px-7 rounded-lg hover:scale-105 transition-all shadow-md hover:shadow-2xl"
                        >
                            Login
                        </button>
                        {/* <p className="text-sm mt-5 text-B20">
                            Already have an account ?{" "}
                            <Link href="/login" className="text-sm text-B30 font-semibold">
                                Login
                            </Link>
                        </p> */}
                    </div>
                ) : !isLinkedFarcaster ? (
                    ready &&
                    authenticated && (
                        <div className="text-center flex flex-col items-center">
                            <h2 className="text-3xl font-semibold mb-4 text-gray-800">
                                Please link with Farcaster
                                <br /> to proceed.
                            </h2>
                            <button
                                onClick={linkFarcaster}
                                className="bg-B0 hover:bg-B10 text-white text-xl font-medium py-3 px-7 rounded-lg hover:scale-105 transition-all shadow-md hover:shadow-2xl"
                            >
                                Link Farcaster
                            </button>
                        </div>
                    )
                ) : !isSession ? (
                    <div className="text-center flex flex-col items-center">
                        <h2 className="text-3xl font-semibold mb-4 text-gray-800">
                            Create a session for a seamless
                            <br /> payment experience
                        </h2>
                        <CreateSessionButton />
                        <div className="mt-8 text-sm text-gray-700">
                            <p>
                                After creating a session, your wallet will not need to be opened for sending
                                transactions.
                                <br /> We cover gas fees for you, making tipping in USDC effortless.
                            </p>
                            <p>Protected by Biconomy.</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center flex flex-col items-center justify-center">
                        <p className="mb-8 font-semibold text-2xl w-3/4 text-gray-800">
                            Deposit USDC to your account to start using the platform.
                        </p>
                        <CustomButton onClick={handleRedirectToDeposit}>Deposit USDC</CustomButton>
                    </div>
                )}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 mt-8 text-sm text-gray-700 flex items-center gap-3 w-full justify-center">
                    <p>Protected by </p>
                    <img src="https://auth.privy.io/logos/privy-logo.png" className="h-5" />
                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;
