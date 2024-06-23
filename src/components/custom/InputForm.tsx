import React, { useEffect, useState } from "react";
import { useLazyQuery, useLazyQueryWithPagination } from "@airstack/airstack-react";
import { init } from "@airstack/airstack-react";
import Post from "./Post";
import {
    createMultiChainValidationModule,
    createSession,
    createSessionKeyEOA,
    createSmartAccountClient,
    DEFAULT_MULTICHAIN_MODULE,
    PaymasterMode,
    Policy,
    Rule,
    SessionLocalStorage,
} from "@biconomy/account";
import { base } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, BASE_BICONOMY_AA_KEY } from "@/utils/keys";
import Footer from "./Footer";

init("10414e57f4ac344a787f5d6ad0035ded4");

const UNIVERSAL_RESOLVER = `
query MyQuery($address: Identity!) {
  Wallet(input: {identity: $address, blockchain: ethereum}) {
    identity
    addresses
    primaryDomain {
      name
      isPrimary
    }
    domains(input: {limit: 50}) {
      name
      isPrimary
    }
    socials {
      dappName
      profileName
      profileBio
      profileCreatedAtBlockTimestamp
      userAssociatedAddresses
    }
  }
}
`;

const InputForm = () => {
    const [smartWallet, setSmartWallet] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [sessionLoading, setSessionLoading] = useState(false);
    const account = useAccount();
    const { data: walletClient } = useWalletClient();

    const [resolveIdentity, { data, loading, error, pagination }] = useLazyQueryWithPagination(
        UNIVERSAL_RESOLVER

        // {
        //   variables: { searchInput: `^${identity}` },
        // }
    );

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        console.log("data: ", data);
        if (data?.Wallet.identity != null) {
            setShowModal(true);
        }
    }, [data]);

    useEffect(() => {
        async function name() {
            // alert("Hello")
            if (!smartWallet && walletClient) {
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
                const smartAccountAddress = await usersSmartAccount.getAccountAddress();
                // alert(smartAccountAddress)
                setSmartWallet(smartAccountAddress);
            }
        }
        name();
    });

    const handleSubmit = async () => {
        try {
            console.log("Input value:", inputValue);
            await resolveIdentity?.({ address: inputValue });
            setInputValue("");
        } catch (error) {
            alert("Error to fetch wallet details");
        }
    };

    const createSessions = async () => {
        try {
            setSessionLoading(true);

            const multiChainModule = await createMultiChainValidationModule({
                signer: walletClient as any,
                moduleAddress: DEFAULT_MULTICHAIN_MODULE,
            });

            const bundelUrl: string = BICONOMY_MAINNET_BUNDLAR_KEY || "";
            const paymasterApiKey: string = BASE_BICONOMY_AA_KEY || "";
            const rpcUrl: string = MAINNET_INFURA || "";

            // alert(bundelUrl)
            // alert(paymasterApiKey)
            // alert(rpcUrl)

            const usersSmartAccount = await createSmartAccountClient({
                signer: walletClient,
                bundlerUrl: bundelUrl,
                biconomyPaymasterApiKey: paymasterApiKey,
                rpcUrl: rpcUrl,
                defaultValidationModule: multiChainModule,
                activeValidationModule: multiChainModule,
            });
            console.log("usersSmartAccount: ", usersSmartAccount);
            const smartAccountAddress = await usersSmartAccount.getAccountAddress();
            console.log("smartAccountAddress: ", smartAccountAddress);

            // const sessionLocalStorage = new SessionLocalStorage(smartAccountAddress);
            // const data = await sessionLocalStorage.clearPendingSessions()
            // const sessiondata = await sessionLocalStorage.getAllSessionData();
            // console.log("sessiondata: ", sessiondata);

            const { sessionKeyAddress, sessionStorageClient }: any = await createSessionKeyEOA(usersSmartAccount, base);
            console.log("sessionKeyAddress: ", sessionKeyAddress);

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
                    // contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
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
            console.log("session: ", session);
            const {
                receipt: { transactionHash },
                success,
            } = await wait();
            console.log("success: ", success);
            console.log("receipt: ", transactionHash);
            setSessionLoading(false);
        } catch (error) {
            setSessionLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-center items-center h-screen">
                <div className="absolute top-1/3 text-center">
                    <h6 className="text-6xl">
                        Social-Tip for{" "}
                        <span className="text-blue">
                            <b>Contributions</b>
                        </span>
                    </h6>
                </div>
                <div className="flex flex-col items-center w-2/3">
                    <div>
                        <h6 className="text-2xl">
                            <b>Your Biconomy Smart Wallet:</b> <u>{smartWallet}</u>
                        </h6>
                    </div>
                    <div>
                        <h6 className="text-3xl">Create sesson key once using smart wallet to tx without multiple sign.</h6>
                    </div>
                    <button
                        onClick={createSessions}
                        className={`m-4 px-4 py-2 text-white rounded-md transition-colors duration-300 ${
                            sessionLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {sessionLoading ? "Loading..." : " Create Session for tip"}
                    </button>

                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        placeholder="Seach ENS for Tip..."
                    />

                    <button
                        onClick={handleSubmit}
                        className={`mt-4 px-4 py-2 text-white rounded-md transition-colors duration-300 ${
                            loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </div>
                {showModal && <Post onClose={() => setShowModal(false)} data={data} />}
            </div>
        </div>
    );
};

export default InputForm;
