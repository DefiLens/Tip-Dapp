"use client";
import AvatarIcon from "@/components/Avatar";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import PostCard from "@/components/post/PostCard";
import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import { postDateFormat, shorten } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

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

    const [showFollows, setShowFollows] = useState<boolean>(false);

    return (
        <NavigationLayout>
            <div className="relative">
                <div className="flex flex-col gap-7 p-4 border-b border-fuchsia-100 sticky z-[1] top-16 bg-white h-48">
                    <button className="absolute top-3 right-3 text-fuchsia-800 text-xl">
                        <IoMdCreate />
                    </button>
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
                                <p>{user?.bio.slice(0,130)}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center gap-2">
                        <div>
                            <div>
                                <p>Tip Recieved: 2.23 Usdc</p>
                            </div>
                            <div>
                                <p>Tip Given: 1.24 Usdc</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                            <button
                                onClick={() => setShowFollows(true)}
                                className="px-2 py-1 rounded-xl transition-all duration-300 text-sm bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200"
                            >
                                <span className="text-fuchsia-900">{user?.followers?.length}</span> Followers
                            </button>
                            <button
                                onClick={() => setShowFollows(true)}
                                className="px-2 py-1 rounded-xl transition-all duration-300 text-sm bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200"
                            >
                                <span className="text-fuchsia-900">{user?.following?.length}</span> Following
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-3 p-4 border-b border-fuchsia-100">
                    <h1 className="text-gray-700 text-2xl font-semibold px-4 border-b border-fuchsia-100">My Posts</h1>
                    <div className="grid gap-4">
                        {posts.map((post, index) => (
                            <PostCard key={index} post={post} />
                        ))}
                    </div>
                </div>
                {showFollows && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                        <div className="rounded-lg relative min-h-[40%] min-w-[40%] bg-white">
                            <button
                                onClick={() => setShowFollows(false)}
                                className="absolute top-4 right-4 text-xl text-black"
                            >
                                <RxCross2 />
                            </button>

                            <div className=" border border-red-600">a</div>
                        </div>
                    </div>
                )}
            </div>
        </NavigationLayout>
    );
};

export default page;
