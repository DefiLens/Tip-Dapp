import { RxCross2 } from "react-icons/rx";
import { IPost } from "./PostList";
import PostCard from "./post/PostCard";
import { DataState } from "@/context/dataProvider";
import AvatarIcon from "./Avatar";
import { shorten } from "@/utils/constants";
import { HiBadgeCheck } from "react-icons/hi";
import CustomButton from "./custom/CustomButtons";
import axios from "axios";
import { BASE_URL } from "@/utils/keys";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

interface IRepostProps {
    post: IPost;
    showRepost: boolean;
    setShowRepost: React.Dispatch<React.SetStateAction<boolean>>;
}

const Repost = ({ post, showRepost, setShowRepost }: IRepostProps) => {
    const { posts, setPosts } = DataState();

    const { user } = DataState();
    const { getAccessToken } = usePrivy();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");

    const repostPost = async (postId: string, content?: string) => {
        try {
            setIsLoading(true);
            const accessToken = await getAccessToken();

            const response = await axios.post(
                `${BASE_URL}/post/repost/${postId}`,
                {
                    content,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setPosts((prev: any) => [response.data.post, ...prev]);
            setIsLoading(false);
            setShowRepost(false);
        } catch (error) {
            console.error("Error reposting the post:", error);
            setIsLoading(false);
            throw error;
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
            <div className="rounded-2xl relative bg-white overflow-hidden py-3">
                <div className="flex items-center justify-between gap-2 px-4 pt-1 pb-5">
                    <h1 className="text-lg font-bold">Repost</h1>
                    <button onClick={() => setShowRepost(false)} className="text-xl text-black">
                        <RxCross2 />
                    </button>
                </div>
                <div className="max-h-[70vh] min-w-[25vw] w-full overflow-y-auto">
                    <div className="flex w-full px-4">
                        <div className="relative flex flex-col items-center">
                            {user?.image ? (
                                <img
                                    src={user?.image || "https://via.placeholder.com/40"}
                                    className="h-12 w-12 rounded-full"
                                    alt="Profile"
                                />
                            ) : (
                                <div className="h-12 w-12">
                                    <AvatarIcon address={user?.smartWalletAddress} />
                                </div>
                            )}
                            <div className="w-[1px] bg-W100 h-full mt-4"></div>
                        </div>
                        <div className="flex flex-col gap-2 flex-1 px-3">
                            <p className="text-lg text-primary-text font-semibold flex gap-2">
                                <span className="flex items-center gap-1">
                                    {user?.name ? user?.name : shorten(post?.userId?.smartAccountAddress)}
                                    {user?.isFarcasterLinked && <HiBadgeCheck className="text-green-600 text-xl" />}
                                </span>
                            </p>

                            <div className="mb-4">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    placeholder="Share you ideas..."
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 resize-none"
                                    maxLength={2000}
                                    rows={5}
                                />
                                <div className="text-right text-gray-600">
                                    {content.length}/{2000}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-lg">
                        <PostCard post={post} isRepost={true} />
                    </div>
                </div>
                <div className="px-8 pt-4 pb-2 flex items-center justify-end">
                    <CustomButton
                        disabled={isLoading}
                        isLoading={isLoading}
                        onClick={() => {
                            repostPost(post._id, content);
                        }}
                    >
                        Repost
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

export default Repost;
