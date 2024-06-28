import { BICONOMY_MAINNET_BUNDLAR_KEY, MAINNET_INFURA, BASE_BICONOMY_AA_KEY } from "@/utils/keys";
import {
    DEFAULT_MULTICHAIN_MODULE,
    PaymasterMode,
    Policy,
    Rule,
    createMultiChainValidationModule,
    createSession,
    createSessionKeyEOA,
    createSmartAccountClient,
} from "@biconomy/account";
import React, { useState } from "react";
import { base } from "viem/chains";
import { useWalletClient } from "wagmi";
import CustomButton from "./custom/CustomButtons";

const CreateSessionButton = () => {
    const { data: walletClient } = useWalletClient();

    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            const smartAccountAddress = await usersSmartAccount.getAccountAddress();

            // const sessionLocalStorage = new SessionLocalStorage(smartAccountAddress);
            // const data = await sessionLocalStorage.clearPendingSessions()
            // const sessiondata = await sessionLocalStorage.getAllSessionData();
            // console.log("sessiondata: ", sessiondata);

            const { sessionKeyAddress, sessionStorageClient }: any = await createSessionKeyEOA(
                usersSmartAccount,
                base
            );

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
            // console.log("success: ", success);
            // console.log("receipt: ", transactionHash);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    return (
        <div>
            <CustomButton className="w-40" disabled={isLoading} isLoading={isLoading} onClick={makeSession}>Create Sessions</CustomButton>
        </div>
    );
};

export default CreateSessionButton;
