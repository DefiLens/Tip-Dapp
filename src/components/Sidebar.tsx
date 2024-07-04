import { FaHome, FaBell, FaCompass, FaBookmark, FaUser, FaTelegram, FaTwitter } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { BiSolidDownload } from "react-icons/bi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdCreate } from "react-icons/io";
import Image from "next/image";
import { defiLogo } from "../../public/assets";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { IoCart } from "react-icons/io5";

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
import CustomButton from "./custom/CustomButtons";
import { Address } from "viem";
import { DataState } from "@/context/dataProvider";
import Loading from "./Loading";
import { RxCross2 } from "react-icons/rx";
import CopyButton from "./custom/CopyButton";
import { FiExternalLink } from "react-icons/fi";
import { shorten } from "@/utils/constants";
import { shorten } from "@/utils/constants";

const Sidebar = () => {
    const pathname = usePathname();
    const { isBiconomySession, isLoadingBiconomySession, setIsLoadingBiconomySession } = DataState();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { icon: <FaHome />, name: "Home", link: "/" },
        { icon: <IoMdCreate />, name: "Create Post", link: "/create-post" },
        // { icon: <FaBell />, name: "Notifications", link: "/notification" },
        // { icon: <FaCompass />, name: "Explore", link: "/explore" },
        { icon: <BiSolidDownload />, name: "Deposit", link: "/deposit" },
        // { icon: <IoCart />, name: "Cart", link: "/cart" },
        { icon: <FaBookmark />, name: "Bookmarks", link: "/bookmarks" },
        { icon: <FaUser />, name: "Profile", link: "/profile" },
    ];

    const socialItems = [
        { icon: <FaTelegram />, name: "Telegram", link: "https://t.me/defilenscommunity" },
        { icon: <FaTwitter />, name: "Twitter", link: "https://x.com/DefiLensTech" },
    ];

    const { checkSession } = DataState();
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

            if (transactionHash) {
                checkSession();
                setShowSuccess(true);
                setTxhash(`https://basescan.org/tx/${transactionHash}`);
            }
            setIsLoading(false);
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
            {/* Hamburger menu for mobile view */}
            <div className="sm:hidden fixed top-4 left-4 z-40">
                <button onClick={toggleDrawer} className="p-2">
                    <AiOutlineMenu size={20} />
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed sm:sticky top-0 h-screen z-50 bg-W0 sm:bg-transparent transition-transform transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
                }`}
            >
                <div className="w-60 sm:w-fit lg:w-60 h-full flex flex-col justify-between px-1 border-B900 border-r pt-3">
                    <div className="space-y-2">
                        <h1 className="flex items-center justify-center w-full font-bold text-sm md:text-xl h-[5rem]">
                            <Link href="/">
                                <div className="flex items-center gap-3 w-full justify-center">
                                    <Image
                                        src={defiLogo}
                                        alt="Logo"
                                        className="w-12 shadow-sm shadow-white rounded-2xl"
                                    />
                                    <span className="block sm:hidden lg:block text-2xl text-gray-700 font-bold">
                                        Social Tip
                                    </span>
                                </div>
                            </Link>
                        </h1>
                        {menuItems.map((item, index) => (
                            <Link
                                href={item.link}
                                key={index}
                                className={`flex items-center space-x-4 px-4 py-3 hover:bg-B900 cursor-pointer rounded-lg
                                ${pathname === item.link && "bg-B800"}
                                `}
                            >
                                <span className="text-B0 text-lg">{item.icon}</span>
                                <span className="inline sm:hidden lg:inline text-B30 text-base font-bold">
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                    <div className="space-y-2 ">
                        {socialItems.map((item, index) => (
                            <Link
                                href={item.link}
                                target="_blank"
                                key={index}
                                className="flex items-center space-x-4 px-4 py-3 hover:bg-B900 cursor-pointer rounded-lg"
                            >
                                <span className="text-B0 text-lg">{item.icon}</span>
                                <span className="inline sm:hidden lg:inline text-B30 text-base font-bold">
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                        <div className="flex flex-col gap-2 justify-center px-4 py-4 border-t border-B900">
                            {isLoadingBiconomySession ? (
                                <div className="animate-pulse h-8 rounded-lg w-full bg-gray-200"></div>
                            ) : (
                                <>
                                    {isBiconomySession ? (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaCircleCheck className="text-green-600 text-lg" />
                                            <span className="font-semibold block sm:hidden lg:block">
                                                Session is Active
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaCircleXmark className="text-red-600 text-lg" onClick={makeSession} />
                                            <span className="font-semibold block sm:hidden lg:block">
                                                Session was Expired
                                            </span>
                                        </div>
                                    )}
                                    {!isBiconomySession && (
                                        <CustomButton
                                            className="w-40 block sm:hidden lg:block"
                                            disabled={isLoading}
                                            isLoading={isLoading}
                                            onClick={makeSession}
                                        >
                                            Create Sessions
                                        </CustomButton>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile view */}
            {isOpen && <div className="sm:hidden fixed z-40 inset-0 bg-black opacity-50" onClick={toggleDrawer}></div>}
            {isLoading && <Loading />}
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 h-screen max-w-screen w-screen z-[200]">
                    <div className="rounded-2xl relative bg-white max-w-[90%] flex flex-col items-center p-3 shadow-2xl">
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
                                    {shorten(txHash)}
                                    {shorten(txHash)}
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
        </div>
    );
};

export default Sidebar;
