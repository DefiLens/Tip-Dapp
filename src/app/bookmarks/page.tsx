"use client";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "@/components/post/PostCard";
import axiosInstance from "@/utils/axiosInstance";
import { usePrivy } from "@privy-io/react-auth";
import { BASE_URL } from "@/utils/keys";

const page = () => {
    const { getAccessToken } = usePrivy();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookmarkedPosts = async () => {
            try {

                const accessToken = await getAccessToken();
                const response = await axios.get(`${BASE_URL}/post/bookmarked`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setPosts(response.data.bookmarkedPosts);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bookmarked posts:", err);
                setError("Error fetching bookmarked posts");
                setLoading(false);
            }
        };

        fetchBookmarkedPosts();
    }, []);

    return (
        <NavigationLayout>
            {posts.length === 0 ? <p className="p-8 text-center w-full">No bookmarked posts found.</p> : posts.map((post) => <PostCard post={post} />)}
        </NavigationLayout>
    );
};

export default page;