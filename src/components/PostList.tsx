import { useEffect, useState } from "react";
import PostCard from "./post/PostCard";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { BASE_URL } from "@/utils/keys";
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

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({ userId: "", dappName: "" });
    const { getAccessToken } = usePrivy();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // const response = await axiosInstance.get("/post", {
                //     params: {
                //         page,
                //         limit: 20,
                //         userId: filters.userId,
                //         dappName: filters.dappName,
                //     },
                // });

                const accessToken = await getAccessToken();
                const response = await axios.get(`${BASE_URL}/post`,
                {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                setPosts(response.data.posts);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    const morePosts = async () => {
        try {
            const nextPage = page + 1;
            const response = await axiosInstance.get("/post", {
                params: {
                    page: nextPage,
                    limit: 20,
                    userId: filters.userId,
                    dappName: filters.dappName,
                },
            });
            setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
            setPage(nextPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching more posts:", error);
        }
    };

    return (
        <div className="container mx-auto">
            <div className="grid gap-4">
                {posts.map((post, index) => (
                    <PostCard key={index} post={post} />
                ))}
            </div>
            {page < totalPages && (
                <div className="mt-4 flex justify-center items-center">
                    <button
                        onClick={morePosts}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostList;
