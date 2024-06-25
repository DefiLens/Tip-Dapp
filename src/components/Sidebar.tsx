import { FaHome, FaBell, FaCompass, FaBookmark, FaUser, FaTelegram, FaTwitter } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { BiSolidDownload } from "react-icons/bi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdCreate } from "react-icons/io";
import Image from "next/image";
import { defiLogo } from "../../public/assets";

const Sidebar = () => {
    const pathname = usePathname();
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
        { icon: <FaBookmark />, name: "Bookmarks", link: "/bookmarks" },
        { icon: <FaUser />, name: "Profile", link: "/profile" },
    ];

    const socialItems = [
        { icon: <FaTelegram />, name: "Telegram" },
        { icon: <FaTwitter />, name: "Twitter" },
    ];

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
                className={`fixed sm:sticky top-0 h-screen z-50 bg-white transition-transform transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
                }`}
            >
                <div className="w-60 sm:w-fit lg:w-60 h-full flex flex-col justify-between px-1 border-fuchsia-100 border-r pt-3">
                    <div className="space-y-2">
                        <h1 className="flex items-center justify-center w-full font-bold text-sm md:text-xl h-[5rem]">
                            <Link href="/">
                                <div className="flex items-center gap-3 w-full justify-center">
                                    <Image
                                        src={defiLogo}
                                        alt="Logo"
                                        className="w-12 shadow-sm shadow-white rounded-2xl"
                                    />
                                    <span className="block sm:hidden lg:block text-2xl text-gray-700 font-bold">Defilens</span>
                                </div>
                            </Link>
                        </h1>
                        {menuItems.map((item, index) => (
                            <Link
                                href={item.link}
                                key={index}
                                className={`flex items-center space-x-4 px-4 py-3 hover:bg-fuchsia-50 cursor-pointer rounded-lg
                                ${pathname === item.link && "bg-fuchsia-100"}
                                `}
                            >
                                <span className="text-fuchsia-500 text-lg">{item.icon}</span>
                                <span className="inline sm:hidden lg:inline text-gray-700">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="space-y-2 mb-10">
                        {socialItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-4 px-4 py-3 hover:bg-fuchsia-50 cursor-pointer rounded-lg"
                            >
                                <span className="text-fuchsia-500 text-lg">{item.icon}</span>
                                <span className="inline sm:hidden lg:inline text-gray-700">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overlay for mobile view */}
            {isOpen && <div className="sm:hidden fixed z-40 inset-0 bg-black opacity-50" onClick={toggleDrawer}></div>}
        </div>
    );
};

export default Sidebar;
