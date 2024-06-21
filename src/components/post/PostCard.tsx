import axiosInstance from "@/utils/axiosInstance";
import { postDateFormat } from "@/utils/constants";
import axios from "axios";
import React, { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { PiCoinLight } from "react-icons/pi";

const PostCard = ({ post }: any) => {
    const handleTip = async (postId: string, amount: number) => {
        try {
            const response = await axiosInstance.post("/user/post/tip", { postId, amount }, { withCredentials: true });
            console.log("Tip added successfully:", response.data);
            // Refresh posts after tipping
            const updatedPosts = await axiosInstance.get("/user/post");
            // setPosts(updatedPosts.data);
        } catch (error) {
            console.error("Error adding tip:", error);
        }
    };

    const [like, setLike] = useState<boolean>(false);
    return (
        <div className="bg-white p-4 min-w-full max-w-md flex flex-col gap-4 border-t border-sky-100">
            <div className="flex gap-2 w-full">
                <img src={post.createdBy.farcaster.pfp} className="h-10 w-10 rounded-full" />
                <div className="flex flex-col h-10 justify-center text-sm text-gray-500">
                    <p className="text-sm text-gray-600">
                        {post.isSelfCreated
                            ? post.userId.farcaster.displayName
                            : `Created by ${post.createdBy.farcaster.displayName}`}
                    </p>
                    <p>
                        @{post.userId.farcaster.username}{" "}
                        <span className="text-xs">{postDateFormat(post.createdAt)}</span>
                    </p>
                </div>
            </div>
            <p className="text-sm text-gray-500">{post.content}</p>

            {/* <div className="mt-2">
                <button
                    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition duration-200"
                    onClick={() => handleTip(post._id, 10)} // Example tip amount
                >
                    Tip 10
                </button>
            </div>
            <div className="mt-2">
                <h4 className="text-sm font-semibold">Tips:</h4>
                {post.tips.map((tip: any, index: number) => (
                    <p key={index} className="text-sm text-gray-500">
                        {`From @${tip.from.farcaster.username}: ${tip.amount} USDC`}
                    </p>
                ))}
            </div> */}

            <div className="flex gap-4 justify-between items-center">
                <div className="flex gap-4">
                    <button
                        onClick={() => setLike(!like)}
                        className="flex gap-2 items-center rounded-lg bg-gray-200 hover:bg-gray-300 px-2 py-1 cursor-pointer"
                    >
                        {like ? (
                            <>
                                <AiFillLike />
                                <span className="text-xs">Like</span>
                            </>
                        ) : (
                            <>
                                <AiOutlineLike />
                                <span className="text-xs">Like</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => setLike(!like)}
                        className="flex gap-2 items-center rounded-lg bg-gray-200 hover:bg-gray-300 px-2 py-1 cursor-pointer"
                    >
                        <PiCoinLight />
                        <span className="text-xs">Tip</span>
                    </button>
                </div>
                <div className="flex gap-4">
                    <span className="text-xs">12 Likes</span>
                    <span className="text-xs">$100 of tips</span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
