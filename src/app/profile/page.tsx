"use client";
import AvatarIcon from "@/components/Avatar";
import UserList from "@/components/UserList";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import PostCard from "@/components/post/PostCard";
import UserListSkeleton from "@/components/skeletons/UserListSkeleton";
import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import { postDateFormat, shorten } from "@/utils/constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const UserFollowers = ({ url }: any) => {
    const { user } = DataState();
    const [followers, setFollowers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (url) {
            fetchFollowers();
        }
    }, [url, user]);

    const fetchFollowers = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(`/user/${url}`);
            if (url === "/user-followers") {
                setFollowers(response.data.followers);
            } else {
                setFollowers(response.data.following);
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error("Error fetching followers:", err);
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold">Followers</h3>
                {isLoading ? (
                    <div className="flex flex-col gap-3">
                        <UserListSkeleton />
                        <UserListSkeleton />
                        <UserListSkeleton />
                        <UserListSkeleton />
                    </div>
                ) : followers?.length > 0 ? (
                    followers?.map((follower: any) => <UserList key={follower._id} currentUser={follower} />)
                ) : (
                    <>No data found</>
                )}
            </div>
        </div>
    );
};

const TipStats = () => {
    const { user } = DataState();
    const [tipsGiven, setTipsGiven] = useState([]);
    const [totalTipsReceived, setTotalTipsReceived] = useState(0);
    const [totalTipsGiven, setTotalTipsGiven] = useState(0);

    useEffect(() => {
        const fetchTipStats = async () => {
            try {
                const response = await axiosInstance.get("/user/tip-stats");
                setTipsGiven(response.data.tipsGiven);
                setTotalTipsReceived(response.data.totalTipsReceived);
                setTotalTipsGiven(response.data.totalTipsGiven);
            } catch (error) {
                console.error("Error fetching tip stats:", error);
            }
        };

        if (user) {
            fetchTipStats();
        }
    }, [user]);

    return (
        <div>
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-primary-text">Total Tips Received:</h3>
                <p className="text-sm text-secondary-text">{totalTipsReceived} USDC</p>
            </div>
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-primary-text">Total Tips Given:</h3>
                <p className="text-sm text-secondary-text">{totalTipsGiven} USDC</p>
            </div>
            {/* <div>
                <h3 className="text-xl font-semibold mb-2">Top Tips Given:</h3>
                {tipsGiven.length > 0 ? (
                    <ul>
                        {tipsGiven.map((tip: any) => (
                            <li key={tip._id} className="mb-2">
                                <div className="flex items-center gap-2">
                                    {tip.to.image ? (
                                        <img src={tip.to.image} alt="Profile" className="h-8 w-8 rounded-full" />
                                    ) : (
                                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                    )}
                                    <span className="text-lg font-medium">{tip.to.name}</span>
                                    <span className="text-lg">- {tip.amount} USDC</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-lg">No tips given yet.</p>
                )}
            </div> */}
        </div>
    );
};

const page = () => {
    const { user, isGettingUserData } = DataState();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axiosInstance.get("/post/userPosts", {
                    params: {
                        page: page,
                        limit: 10, // Adjust limit as needed
                    },
                });

                setPosts(response.data.posts);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("Error fetching posts");
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [page]);

    const [showFollowers, setShowFollowers] = useState<boolean>(false);
    const [showFollowing, setShowFollowing] = useState<boolean>(false);

    return (
        <NavigationLayout>
            <div className="relative">
                {/* <div className="flex flex-col gap-7 p-4 border-b border-blue-100 sticky z-[1] top-16 bg-white h-48"> */}
                <div className="flex flex-col gap-7 p-4 border-b border-blue-100 bg-white h-48">
                    <Link href="/profile/edit" className="absolute top-3 right-3 text-blue-800 text-xl">
                        <IoMdCreate />
                    </Link>
                    {isGettingUserData ? (
                        <></>
                    ) : (
                        <div className="flex gap-5 w-full">
                            {user?.image ? (
                                <img src={user?.image} className="h-24 w-24 rounded-full" alt="Profile" />
                            ) : (
                                <div className="h-24 w-24">
                                    <AvatarIcon address={user?.smartAccountAddress} />
                                </div>
                            )}
                            <div className="flex flex-col h-20 justify-center text-sm text-gray-500">
                                <p className="text-primary-text text-2xl font-bold">
                                    {user?.name ? user?.name : shorten(user?.smartAccountAddress)}
                                </p>
                                <p>{user?.bio?.slice(0, 130)}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center gap-2">
                        <TipStats />
                        <div className="flex items-center justify-end gap-4">
                            <button
                                onClick={() => setShowFollowers(true)}
                                className="px-2 py-1 rounded-xl transition-all duration-300 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                                <span className="text-blue-900">{user?.followers?.length}</span> Followers
                            </button>
                            <button
                                onClick={() => setShowFollowing(true)}
                                className="px-2 py-1 rounded-xl transition-all duration-300 text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                                <span className="text-blue-900">{user?.following?.length}</span> Following
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 p-4 border-b border-blue-100">
                    <h1 className="text-gray-700 text-2xl font-semibold px-4 border-blue-100">My Posts</h1>
                    <div className="grid gap-4">
                        {posts.map((post, index) => (
                            <PostCard key={index} post={post} />
                        ))}
                    </div>
                </div>
                {showFollowers && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                        <div className="rounded-lg relative max-h-[50%] min-h-[30%] max-w-[25%] min-w-[25%]  bg-white p-4">
                            <button
                                onClick={() => setShowFollowers(false)}
                                className="absolute top-4 right-4 text-xl text-black"
                            >
                                <RxCross2 />
                            </button>
                            <UserFollowers url="/user-followers" />
                        </div>
                    </div>
                )}
                {showFollowing && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                        <div className="rounded-lg relative max-h-[50%] min-h-[30%] max-w-[25%] min-w-[25%] bg-white p-4">
                            <button
                                onClick={() => setShowFollowing(false)}
                                className="absolute top-4 right-4 text-xl text-black"
                            >
                                <RxCross2 />
                            </button>
                            {/* <UserFollowing /> */}
                            <UserFollowers url="/user-following" />
                        </div>
                    </div>
                )}
            </div>
        </NavigationLayout>
    );
};

export default page;
