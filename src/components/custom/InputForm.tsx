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
import { polygon } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, POLYGON_BICONOMY_AA_KEY } from "@/utils/keys";

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
      profileCreatedAtBlockTimestamp
      userAssociatedAddresses
    }
  }
}
`;

const InputForm = () => {
    const [inputValue, setInputValue] = useState("");
    const [showModal, setShowModal] = useState(false);
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

    const handleSubmit = async () => {
        console.log("Input value:", inputValue);
        await resolveIdentity?.({ address: inputValue });
        setInputValue("");
    };

    const createSessions = async () => {
        const multiChainModule = await createMultiChainValidationModule({
            signer: walletClient as any,
            moduleAddress: DEFAULT_MULTICHAIN_MODULE,
        });

        const bundelUrl: string = BICONOMY_MAINNET_BUNDLAR_KEY || "";
        const paymasterApiKey: string = POLYGON_BICONOMY_AA_KEY || "";
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
        const smartAccountAddress = await usersSmartAccount.getAccountAddress();

        // const sessionLocalStorage = new SessionLocalStorage(smartAccountAddress);
        // const data = await sessionLocalStorage.clearPendingSessions()
        // const sessiondata = await sessionLocalStorage.getAllSessionData();
        // console.log("sessiondata: ", sessiondata);

        const { sessionKeyAddress, sessionStorageClient }: any = await createSessionKeyEOA(usersSmartAccount, polygon);

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
                contractAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
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
        const { wait, session } = await createSession(usersSmartAccount, policy, sessionStorageClient, withSponsorship);
        console.log("session: ", session);
        const {
            receipt: { transactionHash },
            success,
        } = await wait();
        console.log("success: ", success);
        console.log("receipt: ", transactionHash);
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center w-2/3">
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
                <button
                    onClick={createSessions}
                    className={`mt-4 px-4 py-2 text-white rounded-md transition-colors duration-300 ${
                        loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    CreateSessions
                </button>
            </div>
            {showModal && <Post onClose={() => setShowModal(false)} data={data} />}
        </div>
    );
};

export default InputForm;
