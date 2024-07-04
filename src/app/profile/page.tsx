"use client";
import AvatarIcon from "@/components/Avatar";
import UserList from "@/components/UserList";
import CustomButton from "@/components/custom/CustomButtons";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import PostCard from "@/components/post/PostCard";
import UserListSkeleton from "@/components/skeletons/UserListSkeleton";
import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import { postDateFormat, shorten } from "@/utils/constants";
import { BASE_URL } from "@/utils/keys";
import { useLinkAccount, usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { HiBadgeCheck } from "react-icons/hi";
import PostSkeleton from "@/components/skeletons/PostSkeleton";

const UserFollowers = ({ url }: any) => {
    const { user } = DataState();
    const { getAccessToken } = usePrivy();
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
            // const response = await axiosInstance.get(`/user/${url}`);
            const accessToken = await getAccessToken();
            const response = await axios.get(`${BASE_URL}/user/${url}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

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
        <div className="flex flex-col gap-5 w-full">
            <h3 className="text-xl font-bold">Followers</h3>
            <div className="flex flex-col gap-5 w-full overflow-y-auto h-full">
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
    const { getAccessToken } = usePrivy();
    const [tipsGiven, setTipsGiven] = useState([]);
    const [totalTipsReceived, setTotalTipsReceived] = useState(0);
    const [totalTipsGiven, setTotalTipsGiven] = useState(0);

    useEffect(() => {
        const fetchTipStats = async () => {
            try {
                // const response = await axiosInstance.get("/user/tip-stats");
                const accessToken = await getAccessToken();
                const response = await axios.get(`${BASE_URL}/user/tip-stats`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

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
    const { user, setUser, isGettingUserData } = DataState();
    const { getAccessToken } = usePrivy();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const accessToken = await getAccessToken();
                const response = await axios.get(`${BASE_URL}/post/userPosts`, {
                    params: {
                        page: page,
                        limit: 10, // Adjust limit as needed
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
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

    const { linkFarcaster } = useLinkAccount({
        onSuccess: async (user, linkMethod, linkedAccount) => {
            // console.log("Farcaster: ", user);
            linkFarcasterApi(user);
        },
        onError: (error) => {
            console.error(error);
        },
    });

    const linkFarcasterApi = async (data: any) => {
        try {
            const accessToken = await getAccessToken();
            const res = await axios.post(`${BASE_URL}/user/link-farcaster`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // const res = await axiosInstance.post("/user/link-farcaster", { farcasterAccount: data });
            setUser(res.data.user);
        } catch (error) {
            console.error("Error sending user data:", error);
        }
    };

    return (
        <NavigationLayout>
            <div className="relative">
                {isGettingUserData ? (
                    <div className="flex flex-col gap-7 p-4 border-b border-blue-100 bg-white ">
                        <div className="flex gap-5 w-full">
                            <div>
                                <div className="h-24 w-24 rounded-full animate-pulse bg-gray-200"></div>
                            </div>
                            <div className="flex flex-col gap-2 h-20 justify-center w-full">
                                <p className="h-5 rounded-lg animate-pulse w-52 bg-gray-200"></p>
                                <p className="h-5 rounded-lg animate-pulse w-full bg-gray-200"></p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <div className="flex flex-col gap-2">
                                <div className="bg-gray-200 rounded-lg h-3 w-20"></div>
                                <div className="bg-gray-200 rounded-lg h-3 w-28"></div>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                <div className="h-7 w-24 rounded-lg bg-gray-200"></div>
                                <div className="h-7 w-24 rounded-lg bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-7 p-4 border-b border-blue-100 bg-white ">
                        <Link href="/profile/edit" className="absolute top-3 right-3 text-blue-800 text-xl">
                            <IoMdCreate />
                        </Link>
                        {isGettingUserData ? (
                            <></>
                        ) : (
                            <>
                                <div className="flex gap-5 w-full">
                                    {user?.image ? (
                                        <img src={user?.image} className="h-24 w-24 rounded-full" alt="Profile" />
                                    ) : (
                                        <div className="h-24 w-24">
                                            <AvatarIcon address={user?.smartAccountAddress} />
                                        </div>
                                    )}
                                    <div className="flex flex-col h-20 justify-center text-sm text-gray-500">
                                        <p className="text-primary-text text-2xl font-bold flex items-center gap-1">
                                            {user?.name ? user?.name : shorten(user?.smartAccountAddress)}
                                            {user?.isFarcasterLinked && (
                                                <HiBadgeCheck className="text-blue-600 text-xl" />
                                            )}
                                        </p>
                                        <p>{user?.bio?.slice(0, 130)}</p>
                                    </div>
                                </div>
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
                                <div>
                                    {isGettingUserData && !user?.isFarcasterLinked && (
                                        <CustomButton onClick={linkFarcaster}>Link Farcaster</CustomButton>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-3 p-4 border-b border-blue-100">
                    <h1 className="text-gray-700 text-2xl font-semibold px-4 border-blue-100">My Posts</h1>
                    <div className="grid gap-4">
                        {loading ? (
                            <>
                                <PostSkeleton />
                                <PostSkeleton />
                            </>
                        ) : (
                            posts.map((post, index) => <PostCard key={index} post={post} />)
                        )}
                    </div>
                </div>
                {showFollowers && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                        <div className="rounded-lg relative h-96 max-w-[25%] min-w-[25%] bg-white p-4 overflow-hidden">
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
                        <div className="rounded-lg relative h-96 max-w-[25%] min-w-[25%] bg-white p-4">
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
