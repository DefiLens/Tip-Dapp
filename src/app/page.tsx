"use client";
import CreatePost from "@/components/CreatePost";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import PostCard from "@/components/post/PostCard";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get("/user/post");
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="flex flex-col items-center font-sans w-full">
            {posts.map((post: any, index) => (
                <PostCard key={index} post={post} />
            ))}
        </div>
    );
};

interface Post {
    _id: string;
    userId: {
        _id: string;
        name: string;
        image: string;
    };
    content: string;
    links: string[];
    forOther: boolean;
    otherUserProfile?: {
        dappName: string;
        profileImage: string;
        profileName: string;
    };
    smartWalletAddress?: string;
    tips: any[];
    likes: string[];
    bookmarks: string[];
    totalTips: number;
    createdAt: string;
    updatedAt: string;
}

const PostList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({ userId: "", dappName: "" });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get("/user/post", {
                    params: {
                        page,
                        userId: filters.userId,
                        dappName: filters.dappName,
                    },
                });
                setPosts(response.data.posts);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, [page, filters]);

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="container mx-auto p-4">
            {/* <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    name="userId"
                    value={filters.userId}
                    onChange={handleFilterChange}
                    placeholder="Filter by User ID"
                    className="border px-2 py-1 rounded"
                />
                <input
                    type="text"
                    name="dappName"
                    value={filters.dappName}
                    onChange={handleFilterChange}
                    placeholder="Filter by DApp Name"
                    className="border px-2 py-1 rounded"
                />
            </div> */}
            <div className="grid gap-4">
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </div>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const MainLayout = () => {
    return (
        <NavigationLayout>
            <PostList />
        </NavigationLayout>
    );
};

export default MainLayout;
