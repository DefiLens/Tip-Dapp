import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import AvatarIcon from "./Avatar";
import { shorten } from "@/utils/constants";
import { DataState } from "@/context/dataProvider";

const UserList = ({ currentUser }: any) => {
    const { user } = DataState();

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
            await axiosInstance.post("/user/follow", {
                targetUserId,
            });
        } catch (err) {
            console.error("Error toggling follow status:", err);
        }
    };

    return (
        <div className="flex items-center gap-5 w-full">
            {currentUser.image ? (
                <img src={currentUser.image} className="h-10 w-10 rounded-full" alt="Profile" />
            ) : (
                <div className="h-10 w-10">
                    <AvatarIcon address={currentUser.smartAccountAddress} />
                </div>
            )}
            <div className="flex flex-col h-10 justify-center text-sm text-gray-500">
                <p className="text-primary-text text-base font-bold">
                    {currentUser.name ? currentUser.name : shorten(currentUser.smartAccountAddress)}
                </p>
            </div>
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
        </div>
    );
};

const SuggestedFollows = () => {
    const { user } = DataState();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            const fetchRandomUsers = async () => {
                try {
                    setIsLoading(true);
                    const response = await axiosInstance.get(`/user/get-follows?user=${user._id}`);
                    // const response = await axios.post('http://localhost:3000/api/random-users', );
                    setUsers(response.data);
                    setIsLoading(false);
                } catch (err) {
                    console.error("Error fetching random users:", err);
                    setIsLoading(false);
                }
            };
            fetchRandomUsers();
        }
    }, [user]);

    return (
        <div className="p-2 w-full border rounded-lg border-fuchsia-200">
            <h1 className="text-xl font-bold mb-2 text-primary-text">Suggested Follows</h1>
            <div className="relative flex flex-col gap-5">
                {isLoading ? (
                    <>
                        <div className="flex items-center gap-5 w-full">
                            <div className="h-10 w-10 rounded-full animate-pulse bg-fuchsia-50"></div>
                            <div className="h-8 rounded-lg flex-1 animate-pulse bg-fuchsia-50"></div>
                        </div>
                        <div className="flex items-center gap-5 w-full">
                            <div className="h-10 w-10 rounded-full animate-pulse bg-fuchsia-50"></div>
                            <div className="h-8 rounded-lg flex-1 animate-pulse bg-fuchsia-50"></div>
                        </div>
                        <div className="flex items-center gap-5 w-full">
                            <div className="h-10 w-10 rounded-full animate-pulse bg-fuchsia-50"></div>
                            <div className="h-8 rounded-lg flex-1 animate-pulse bg-fuchsia-50"></div>
                        </div>
                        <div className="flex items-center gap-5 w-full">
                            <div className="h-10 w-10 rounded-full animate-pulse bg-fuchsia-50"></div>
                            <div className="h-8 rounded-lg flex-1 animate-pulse bg-fuchsia-50"></div>
                        </div>
                    </>
                ) : (
                    users.map((user) => <UserList currentUser={user} />)
                )}
            </div>
        </div>
    );
};

export default SuggestedFollows;
