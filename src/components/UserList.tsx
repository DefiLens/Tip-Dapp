import { DataState } from "@/context/dataProvider";
import AvatarIcon from "./Avatar";
import { shorten } from "@/utils/constants";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

const UserList = ({ currentUser }: any) => {
    const { user, setUser } = DataState();

    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            setIsFollowing(currentUser?.followers?.includes(user._id));
        }
    }, [user]);

    const handleToggleFollow = async (targetUserId: any) => {
        try {
            if (isFollowing) {
                setIsFollowing(false);
            } else {
                setIsFollowing(true);
            }
            const response = await axiosInstance.post("/user/follow", {
                targetUserId,
            });

            setUser(response.data.updatedUser);
        } catch (err) {
            console.error("Error toggling follow status:", err);
        }
    };

    return (
        <div className="flex items-center gap-2 w-full">
            {currentUser.image ? (
                <img src={currentUser.image} className="h-10 w-10 rounded-full" alt="Profile" />
            ) : (
                <div className="h-10 w-10">
                    <AvatarIcon address={currentUser.smartAccountAddress} />
                </div>
            )}
            <div className="flex flex-col h-10 justify-center text-sm text-gray-500 overflow-hidden whitespace-nowrap text-ellipsis">
                <p className="text-primary-text text-base font-bold overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {currentUser.name ? currentUser.name : shorten(currentUser.smartAccountAddress)}
                </p>
            </div>

            {user && (
                <div className="h-10 flex items-center">
                    <button
                        className={`px-2 py-1 rounded-xl transition-all duration-300 text-sm ${
                            isFollowing
                                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                : "bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200"
                        }`}
                        onClick={() => handleToggleFollow(currentUser._id)}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserList;
