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

import AuthLayout from "@/components/layouts/AuthLayout";
import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import { useLogin, useLinkAccount, usePrivy, useLogout } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, BASE_BICONOMY_AA_KEY } from "@/utils/keys";
import {
    DEFAULT_MULTICHAIN_MODULE,
    PaymasterMode,
    Policy,
    Rule,
    SessionLocalStorage,
    createMultiChainValidationModule,
    createSession,
    createSessionKeyEOA,
    createSmartAccountClient,
} from "@biconomy/account";
import { base } from "viem/chains";
import { useWalletClient } from "wagmi";
import { Address } from "viem";
import Loading from "@/components/Loading";
import { RxCross2 } from "react-icons/rx";
import { FiExternalLink } from "react-icons/fi";
import CopyButton from "@/components/custom/CopyButton";
import toast from "react-hot-toast";

const CreateSessionButton = ({ setIsSession }: any) => {
    const { checkSession } = DataState();
    const router = useRouter();
    const { data: walletClient } = useWalletClient();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [txHash, setTxhash] = useState("");

    let smartAccountAddress: Address;
    const makeSession = async () => {
        try {
            setIsLoading(true);
            const multiChainModule = await createMultiChainValidationModule({
                signer: walletClient as any,
                moduleAddress: DEFAULT_MULTICHAIN_MODULE,
            });

            const bundelUrl: string = BICONOMY_MAINNET_BUNDLAR_KEY || "";
            const paymasterApiKey: string = BASE_BICONOMY_AA_KEY || "";
            const rpcUrl: string = MAINNET_INFURA || "";

            const usersSmartAccount = await createSmartAccountClient({
                signer: walletClient,
                bundlerUrl: bundelUrl,
                biconomyPaymasterApiKey: paymasterApiKey,
                rpcUrl: rpcUrl,
                defaultValidationModule: multiChainModule,
                activeValidationModule: multiChainModule,
            });
            console.log("usersSmartAccount: ", usersSmartAccount);
            smartAccountAddress = await usersSmartAccount.getAccountAddress();

            // const sessionLocalStorage = new SessionLocalStorage(smartAccountAddress);
            // const data = await sessionLocalStorage.clearPendingSessions()
            // const sessiondata = await sessionLocalStorage.getAllSessionData();
            // console.log("sessiondata: ", sessiondata);

            const { sessionKeyAddress, sessionStorageClient }: any = await createSessionKeyEOA(usersSmartAccount, base);

            const rules: Rule[] = [
                {
                    /** The index of the param from the selected contract function upon which the condition will be applied */
                    offset: 0,
                    /**
                     * Conditions:
                     *
                     * 0 - Equal
                     * 1 - Less than or equal
                     * 2 - Less than
                     * 3 - Greater than or equal
                     * 4 - Greater than
                     * 5 - Not equal
                     */
                    condition: 5,
                    /** The value to compare against */
                    referenceValue: "0x0000000000000000000000000000000000000000",
                    // referenceValue: "0x8Acf3088E8922e9Ec462B1D592B5e6aa63B8d2D5",
                },
            ];

            /** The policy is made up of a list of rules applied to the contract method with and interval */
            const policy: Policy[] = [
                {
                    /** The address of the sessionKey upon which the policy is to be imparted */
                    sessionKeyAddress,
                    /** The address of the contract to be included in the policy */
                    contractAddress: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                    /** The specific function selector from the contract to be included in the policy */
                    functionSelector: "transfer(address,uint256)",
                    /** The list of rules which make up the policy */
                    rules: rules,
                    /** The time interval within which the session is valid. Setting both to 0 will keep a session alive indefinitely */
                    interval: {
                        validUntil: 0,
                        validAfter: 0,
                    },
                    /** The maximum value that can be transferred in a single transaction */
                    valueLimit: BigInt(0),
                },
            ];
            const withSponsorship = {
                paymasterServiceData: { mode: PaymasterMode.SPONSORED },
            };
            // const usersSmartAccountAddress = sessionStorageClient.smartAccountAddress;
            const { wait, session } = await createSession(
                usersSmartAccount,
                policy,
                sessionStorageClient,
                withSponsorship
            );
            // console.log("session: ", session);
            const {
                receipt: { transactionHash },
                success,
            } = await wait();
            setIsLoading(false);
            if (transactionHash) {
                // router.pus;
                setIsSession(true);
                checkSession();
                setShowSuccess(true);
                toast.success("Session created successfully");
                setTxhash(`https://basescan.org/tx/${transactionHash}`);
            }
            // console.log("success: ", success);
            console.log("receipt: ", transactionHash);
        } catch (error) {
            const sessionLocalStorage = new SessionLocalStorage(smartAccountAddress);

            const data = await sessionLocalStorage.clearPendingSessions();
            // console.log("sessiondata: ", sessiondata);

            setIsLoading(false);
            console.log(error);
        }
    };

    return (
        <div>
            {isLoading && <Loading />}
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 h-screen max-w-screen w-screen z-[200]">
                    <div className="rounded-2xl relative bg-white max-w-[90%] md:max-w-[40%] w-full flex flex-col items-center p-3 shadow-2xl">
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="absolute top-4 right-4 text-xl text-black"
                        >
                            <RxCross2 />
                        </button>

                        <img
                            src="https://cdn3d.iconscout.com/3d/premium/thumb/tick-11928227-9757430.png?f=webp"
                            className="h-40 w-40"
                        />
                        <h1 className="font-semibold text-xl text-green-700">Session Created Successfully</h1>

                        <div className="flex items-center gap-2 text-sm text-B10 w-full overflow-hidden">
                            <span className="font-semibold">Success:</span>
                            <p className="overflow-hidden text-ellipsis flex-1">
                                <a href={txHash} target="_blank" rel="noopener noreferrer">
                                    {txHash}
                                </a>
                            </p>
                            <Link
                                href={txHash}
                                target="_blank"
                                className=" hover:bg-B900 p-1.5 rounded-md cursor-pointer text-xs text-B10"
                            >
                                <FiExternalLink />
                            </Link>
                            <CopyButton copy={txHash} />
                        </div>
                    </div>
                </div>
            )}
            <button
                disabled={isLoading}
                onClick={makeSession}
                className="bg-B0 hover:bg-B10 text-white text-xl font-medium py-3 px-7 rounded-lg hover:scale-105 transition-all shadow-md hover:shadow-2xl"
            >
                Create Sessions
            </button>
        </div>
    );
};

const Login: React.FC = () => {
    const { createSmartAccount, isBiconomySession, checkSession, setUser } = DataState();
    const { ready, user: privyUser, authenticated } = usePrivy();
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [isLinkedFarcaster, setIsLinkedFarcaster] = useState(false);
    const [isSession, setIsSession] = useState(false);

    const router = useRouter();

    const { login } = useLogin({
        onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
            console.log("Login: ", user);

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
            console.log("Farcaster: ", user);
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
                setUser(response.data.user);
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
            const res = await axiosInstance.post("/user/link-farcaster", { farcasterAccount: data });
            setUser(res.data.user);
            setIsLinkedFarcaster(true);
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

    useEffect(() => {
        if (authenticated) {
            checkSession();
            setIsSession(isBiconomySession);
        }
    }, [authenticated, isBiconomySession]);

    console.log("isSession", isSession);
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
                        <CreateSessionButton setIsSession={setIsSession} />
                        <div className="mt-8 text-sm text-gray-700">
                            <p>
                                After creating a session, your wallet will not need to be opened for sending
                                transactions.
                                <br /> We cover gas fees for you, making tipping in USDC effortless.
                            </p>
                            {/* <p>Protected by Biconomy.</p> */}
                        </div>
                    </div>
                ) : (
                    <div className="text-center flex flex-col items-center justify-center">
                        <p className="mb-8 font-semibold text-2xl w-3/4 text-gray-800">
                            Deposit USDC to your account to start using the platform.
                        </p>
                        <Link
                            href="/deposit"
                            className="bg-B0 hover:bg-B10 text-white text-xl font-medium py-3 px-7 rounded-lg hover:scale-105 transition-all shadow-md hover:shadow-2xl"
                        >
                            Deposit USDC
                        </Link>
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
