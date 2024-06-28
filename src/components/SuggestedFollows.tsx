import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { DataState } from "@/context/dataProvider";
import UserListSkeleton from "./skeletons/UserListSkeleton";
import UserList from "./UserList";

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
        <>
            {users.length > 0 ? (
                <div className="p-2 w-full border rounded-lg border-fuchsia-200">
                    <h1 className="text-xl font-bold mb-2 text-primary-text">Suggested Follows</h1>
                    <div className="relative flex flex-col gap-5">
                        {isLoading ? (
                            <>
                                <UserListSkeleton />
                                <UserListSkeleton />
                                <UserListSkeleton />
                                <UserListSkeleton />
                            </>
                        ) : (
                            users.map((user, index) => <UserList key={index} currentUser={user} />)
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default SuggestedFollows;
