import { useEffect, useState } from "react";
import PostCard from "./post/PostCard";
import axiosInstance from "@/utils/axiosInstance";

interface ILinkedAccount {
    address: string;
    type: string;
    verifiedAt: Date;
    firstVerifiedAt: Date;
    latestVerifiedAt: Date;
    chainType: string;
    chainId: string;
    walletClient: string;
    walletClientType: string;
    connectorType: string;
}

interface IWallet {
    address: string;
    chainType: string;
    chainId: string;
    walletClient: string;
    walletClientType: string;
    connectorType: string;
}

interface IUser {
    _id: string;
    did: string;
    createdAt: Date;
    linkedAccounts: ILinkedAccount[];
    image: string;
    name: string;
    bio: string;
    smartAccountAddress: string;
    followers: string[];
    following: string[];
    wallet: IWallet;
}

export interface IPost {
    _id: string;
    userId: IUser;
    otherUserProfile?: any; // Adjust the type based on the actual structure if known
    content: string;
    imgUrl: string;
    links: string[];
    forOther: boolean;
    smartWalletAddress: string;
    tips: string[]; // Assuming tips are an array of strings, adjust based on actual type
    likes: string[]; // Assuming likes are an array of user IDs
    bookmarks: string[]; // Assuming bookmarks are an array of user IDs
    totalTips: number;
    createdAt: Date;
    updatedAt: Date;
}

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
    const [posts, setPosts] = useState<IPost[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({ userId: "", dappName: "" });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get("/post", {
                    params: {
                        page,
                        limit: 40,
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

    // console.log(posts);
    return (
        <div className="container mx-auto">
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

export default PostList;
