import React, { useEffect, useState } from "react";
import { useAccount, useWalletClient, useWriteContract } from "wagmi";
import erc20 from "../../abi/erc20.json";
import {
    createMultiChainValidationModule,
    createSessionKeyEOA,
    createSessionSmartAccountClient,
    createSmartAccountClient,
    DEFAULT_MULTICHAIN_MODULE,
    getSingleSessionTxParams,
    PaymasterMode,
    SessionLocalStorage,
} from "@biconomy/account";
import { encodeFunctionData, parseAbi, parseUnits } from "viem";
import { base } from "viem/chains";
import { useWallets } from "@privy-io/react-auth";
import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, BASE_BICONOMY_AA_KEY } from "@/utils/keys";
import { BigNumber as bg } from "bignumber.js";
bg.config({ DECIMAL_PLACES: 10 });

interface ModalProps {
    onClose: () => void;
    data: any;
}

const Post: React.FC<ModalProps> = ({ onClose, data }) => {
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState<{
        address?: string;
        message?: string;
        amount?: string;
    }>({});
    const { data: hash, writeContract } = useWriteContract();
    const [loading, setLoading] = useState(false);
    const { data: walletClient } = useWalletClient();
    const { wallets } = useWallets();
    const [txHash, setTxhash] = useState("");

    useEffect(() => {
        if(txHash) {
            alert("tx success: " + txHash);
        }
        if (data) {
            setAddress(data.Wallet.addresses[0]);
        }
    }, [data, txHash]);

    const handleSubmit = async () => {
        const newErrors: { address?: string; message?: string; amount?: string } = {};
        if (!address) newErrors.address = "Address is required.";
        if (!message) newErrors.message = "Message is required.";
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
            newErrors.amount = "Amount must be a number greater than zero.";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setTxhash("")
            setLoading(true);
            console.log("Form submitted successfully!");
            // Handle form submission
            const largeNumber = 1e6; // 1 million
            // alert(bg(amount).multipliedBy(largeNumber))

            // await writeContract({
            //     address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
            //     abi: erc20,
            //     functionName: "transfer",
            //     args: [data.Wallet.addresses[0], bg(amount).multipliedBy(largeNumber)],//BigInt(amount) * BigInt(largeNumber)
            // });
            // console.log("account-: ", wallets[0], walletClient);

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
            console.log("usersSmartAccount", usersSmartAccount);
            const { sessionKeyAddress, sessionStorageClient }: any = await createSessionKeyEOA(
                usersSmartAccount,
                base
            );

            const withSponsorship = {
                paymasterServiceData: { mode: PaymasterMode.SPONSORED },
            };
            const usersSmartAccountAddress = sessionStorageClient.smartAccountAddress;
            console.log("usersSmartAccountAddress1-: ", usersSmartAccountAddress);
            // const usersSmartAccountAddress = await usersSmartAccount.getAccountAddress()
            // console.log("usersSmartAccountAddress: ", usersSmartAccountAddress)

            const emulatedUsersSmartAccount = await createSessionSmartAccountClient(
                {
                    accountAddress: usersSmartAccountAddress, // Dapp can set the account address on behalf of the user
                    bundlerUrl: BICONOMY_MAINNET_BUNDLAR_KEY as string,
                    paymasterUrl: `https://paymaster.biconomy.io/api/v1/8453/${BASE_BICONOMY_AA_KEY}`,
                    chainId: 8453,
                },
                usersSmartAccountAddress // Storage client, full Session or simply the smartAccount address if using default storage for your environment
            );
            const transferTx = {
                to: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
                data: encodeFunctionData({
                    abi: parseAbi(["function transfer(address,uint256)"]),
                    functionName: "transfer",
                    args: [data.Wallet.addresses[0], BigInt(bg(amount).multipliedBy(largeNumber).toString())], // BigInt(amount) * BigInt(largeNumber)
                }),
            };
            console.log("transferTx: ", transferTx);

            const sessionLocalStorage = new SessionLocalStorage(usersSmartAccountAddress);
            const data3 = await sessionLocalStorage.clearPendingSessions()
            // const data2 = await sessionLocalStorage.getAllSessionData();
            // console.log("data-: ", data2);

            const params = await getSingleSessionTxParams(
                usersSmartAccountAddress,
                base,
                0 // index of the relevant policy leaf to the tx
            );
            console.log("Params: ", params);

            const { wait } = await emulatedUsersSmartAccount.sendTransaction(transferTx, {
                ...params,
                ...withSponsorship,
            });

            const success = await wait();
            console.log("success: ", success.receipt.transactionHash);
            setTxhash(`https://basescan.org/tx/${success.receipt.transactionHash}`)
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-md shadow-md max-w-md w-full p-6 space-y-6">
                {data?.Wallet?.addresses?.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Wallet Addresses</h3>
                        <ul className="list-disc list-inside">
                            {data.Wallet.addresses.map((address: string, index: number) => (
                                <li key={index} className="text-gray-600">
                                    {address}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {data?.Wallet?.socials?.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Socials</h3>
                        <ul className="list-disc list-inside">
                            {data.Wallet.socials.map(({ dappName, profileName }: any, index: number) => (
                                <li key={index} className="text-gray-600">
                                    {dappName}: {profileName}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {data?.Wallet?.xmtp?.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">XMTP</h3>
                        <p className="text-gray-600">
                            {data.Wallet.xmtp[0].isXMTPEnabled ? "XMTP is enabled" : "XMTP is disabled"}
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md space-y-4">
                <h2 className="text-xl font-semibold">Enter Details</h2>
                <input
                    type="text"
                    value={data.Wallet.addresses[0]}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter address"
                    disabled
                />
                {errors.address && <p className="text-red-500">{errors.address}</p>}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter message"
                />
                {errors.message && <p className="text-red-500">{errors.message}</p>}
                <div className="flex items-center space-x-2">
                    <select
                        value={token}
                        onChange={(e) => setToken(e.target.value as "usdc" | "eth" | "dai")}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA">USDC</option>
                        <option value="eth" disabled>
                            ETH
                        </option>
                        <option value="dai" disabled>
                            DAI
                        </option>
                    </select>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="Amount"
                    />
                </div>
                {errors.amount && <p className="text-red-500">{errors.amount}</p>}

                <button
                    onClick={handleSubmit}
                    className={`mt-4 w-full px-4 py-2 text-white bg-blue-500 rounded-md transition-colors duration-300 hover:bg-blue-600 ${
                        loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Tip"}
                </button>
                {txHash && <p className="mt-4 text-green-500">Transaction hash: {txHash}</p>}
                <button
                    onClick={onClose}
                    className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-md transition-colors duration-300 hover:bg-gray-600"
                >
                    Close
                </button>
            </div>
        </div>

        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        //     <div className="p-4 bg-white rounded-md shadow-md">
        //         {data && data.Wallet && data.Wallet.addresses.length > 0 && (
        //             <div className="mb-4">
        //                 <h3 className="text-lg font-semibold mb-2">Wallet Addresses</h3>
        //                 <ul className="list-disc list-inside">
        //                     {data.Wallet.addresses.map((address: any, index: any) => (
        //                         <li key={index} className="text-gray-600">
        //                             {address}
        //                         </li>
        //                     ))}
        //                 </ul>
        //             </div>
        //         )}

        //         {data && data.Wallet && data.Wallet.socials && data.Wallet.socials.length > 0 && (
        //             <div className="mb-4">
        //                 <h3 className="text-lg font-semibold mb-2">Socials</h3>
        //                 <ul className="list-disc list-inside">
        //                     {data.Wallet.socials.map(({ dappName, profileName }: any, index: any) => (
        //                         <li key={index} className="text-gray-600">
        //                             {dappName}: {profileName}
        //                         </li>
        //                     ))}
        //                 </ul>
        //             </div>
        //         )}

        //         {data && data.Wallet && data.Wallet.xmtp && data.Wallet.xmtp.length > 0 && (
        //             <div className="mb-4">
        //                 <h3 className="text-lg font-semibold mb-2">XMTP</h3>
        //                 <p className="text-gray-600">
        //                     {data.Wallet.xmtp[0].isXMTPEnabled ? "XMTP is enabled" : "XMTP is disabled"}
        //                 </p>
        //             </div>
        //         )}
        //     </div>
        //     <div className="bg-white p-6 rounded-md w-1/2">
        //         <h2 className="text-xl mb-4">Enter Details</h2>
        //         <input
        //             type="text"
        //             value={data.Wallet.addresses[0]}
        //             onChange={(e) => setAddress(e.target.value)}
        //             className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
        //             placeholder="Enter address"
        //             disabled
        //         />
        //         {errors.address && <p className="text-red-500">{errors.address}</p>}
        //         <input
        //             type="text"
        //             value={message}
        //             onChange={(e) => setMessage(e.target.value)}
        //             className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
        //             placeholder="Enter message"
        //         />
        //         {errors.message && <p className="text-red-500">{errors.message}</p>}
        //         <div className="flex items-center mb-2">
        //             <select
        //                 value={token}
        //                 onChange={(e) => setToken(e.target.value as "usdc" | "eth" | "dai")}
        //                 className="px-4 py-2 border border-gray-300 rounded-md mr-2"
        //             >
        //                 <option value="0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA">USDC</option>
        //                 <option value="eth" disabled>
        //                     ETH
        //                 </option>
        //                 <option value="dai" disabled>
        //                     DAI
        //                 </option>
        //             </select>
        //             <input
        //                 type="number"
        //                 value={amount}
        //                 onChange={(e) => setAmount(e.target.value)}
        //                 className="px-4 py-2 border border-gray-300 rounded-md"
        //                 placeholder="Amount"
        //             />
        //         </div>
        //         {errors.amount && <p className="text-red-500">{errors.amount}</p>}
        //         <button
        //             onClick={handleSubmit}
        //             className={`mt-4 px-4 py-2 text-white rounded-md transition-colors duration-300

        //             bg-blue-500 hover:bg-blue-600
        //             `}
        //             // disabled={loading}
        //         >
        //             {/* {loading ? "Sending..." : "Tip"} */}Tip
        //         </button>
        //         {hash && <p className="mt-4 text-green-500">Transaction hash: {hash}</p>}
        //         <button
        //             onClick={onClose}
        //             className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
        //         >
        //             Close
        //         </button>
        //     </div>
        // </div>
    );
};

export default Post;
