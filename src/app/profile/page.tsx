"use client";
import AvatarIcon from "@/components/Avatar";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import PostCard from "@/components/post/PostCard";
import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import { postDateFormat, shorten } from "@/utils/constants";
import React, { useEffect, useState } from "react";

const page = () => {
    const { user, isGettingUserData } = DataState();
    console.log(user);

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

    return (
        <NavigationLayout>
            <div className="flex flex-col gap-7 p-4 border-b border-fuchsia-100">
                {isGettingUserData ? (
                    <></>
                ) : (
                    <div className="flex gap-5 w-full">
                        {user?.image ? (
                            <img src={user?.image} className="h-32 w-32 rounded-full" alt="Profile" />
                        ) : (
                            <div className="h-32 w-32">
                                <AvatarIcon address={"0xA44296D8af02fd49Fe448aC8ff2d11caEC9E076c"} />
                            </div>
                        )}
                        <div className="flex flex-col h-32 justify-center text-sm text-gray-500">
                            <p className="text-primary-text text-2xl font-bold">
                                {user?.name ? user?.name : shorten(user?.smartAccountAddress)}
                            </p>
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-end gap-4">
                    <button className="px-3 py-2 bg-fuchsia-100 hover:bg-fuchsia-200 rounded-xl transition-all duration-300 text-secondary-text">
                        <span className="text-primary-text">3022</span> Followers
                    </button>
                    <button className="px-3 py-2 bg-fuchsia-100 hover:bg-fuchsia-200 rounded-xl transition-all duration-300 text-secondary-text">
                        <span className="text-primary-text">390</span> Following
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-3 p-4 border-b border-fuchsia-100">
                <h1 className="text-gray-700 text-3xl font-semibold px-4">My Posts</h1>
                <div className="grid gap-4">
                    {posts.map((post, index) => (
                        <PostCard key={index} post={post} />
                    ))}
                </div>
            </div>
        </NavigationLayout>
    );
};

export default page;
