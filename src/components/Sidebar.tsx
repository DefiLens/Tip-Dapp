import { FaHome, FaBell, FaCompass, FaBookmark, FaUser, FaTelegram, FaTwitter } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { BiSolidDownload } from "react-icons/bi";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Sidebar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        { icon: <FaHome />, name: "Home", link: "/" },
        { icon: <FaBell />, name: "Notifications", link: "/notification" },
        { icon: <FaCompass />, name: "Explore", link: "/explore" },
        { icon: <FaBookmark />, name: "Saved", link: "/saved" },
        { icon: <BiSolidDownload />, name: "Deposit", link: "/deposit" },
        { icon: <FaUser />, name: "Profile", link: "" },
    ];

    const socialItems = [
        { icon: <FaTelegram />, name: "Telegram" },
        { icon: <FaTwitter />, name: "Twitter" },
    ];

    return (
        <div>
            {/* Hamburger menu for mobile view */}
            <div className="sm:hidden fixed top-4 left-4 z-50">
                <button onClick={toggleDrawer} className="p-2 rounded-md hover:bg-gray-200">
                    <AiOutlineMenu size={24} />
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed sm:sticky top-0 h-screen z-50 bg-white transition-transform transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
                }`}
            >
                <div className="w-80 sm:w-fit lg:w-60 h-full flex flex-col justify-between px-1 border-sky-100 border-r">
                    <div className="space-y-4 mt-10">
                        {menuItems.map((item, index) => (
                            <Link
                                href={item.link}
                                key={index}
                                className={`flex items-center space-x-4 px-4 py-2 hover:bg-sky-50 cursor-pointer rounded-lg
                                ${pathname === item.link && 'bg-sky-100'}
                                `}
                            >
                                <span className="text-sky-500 text-lg">{item.icon}</span>
                                <span className="inline sm:hidden lg:inline">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="space-y-4 mb-10">
                        {socialItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-4 px-4 py-2 hover:bg-sky-50 cursor-pointer rounded-lg"
                            >
                                <span className="text-sky-500 text-lg">{item.icon}</span>
                                <span className="hidden lg:inline">{item.name}</span>
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
