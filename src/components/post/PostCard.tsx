import axiosInstance from "@/utils/axiosInstance";
import { postDateFormat, shorten } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import { PiCoinLight } from "react-icons/pi";
import { BigNumber as bg } from "bignumber.js";
import AvatarIcon from "../Avatar";
import TipModal from "../TipModal";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { DataState } from "@/context/dataProvider";
bg.config({ DECIMAL_PLACES: 10 });
import { FaBookmark } from "react-icons/fa6";
import { FaRegBookmark } from "react-icons/fa6";
import toast from "react-hot-toast";
import { IPost } from "../PostList";
import InputForm from "../custom/InputForm";
import { IoCartOutline } from "react-icons/io5";
import { IoCart } from "react-icons/io5";
interface PostCardProps {
    post: IPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { user, setUser, usdcBalance, isBiconomySession } = DataState();
    const [showTipModal, setShowTipModal] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(post?.likes?.length);

    const [liked, setLiked] = useState<boolean>(post.likes.includes(user?._id));
    const [bookmarked, setBookmarked] = useState(post.bookmarks.includes(user?._id));
    const [isFollowing, setIsFollowing] = useState<boolean>(false);

    const handleLike = async () => {
        try {
            if (!user) {
                toast.error("Login First");
                return;
            }
            if (liked) {
                setLiked(false);
                setLikeCount(likeCount - 1);
                await axiosInstance.post("/post/dislikePost", { postId: post._id });
            } else {
                setLiked(true);
                setLikeCount(likeCount + 1);
                await axiosInstance.post("/post/likePost", { postId: post._id });
            }
        } catch (error) {
            console.error("Error liking/disliking post:", error);
            // Optionally revert state changes if API call fails
            setLiked((prevLiked: boolean) => !prevLiked);
            setLikeCount((prevCount: number) => (liked ? prevCount + 1 : prevCount - 1));
        }
    };

    const handleBookmark = async () => {
        try {
            if (!user) {
                toast.error("Login First");
                return;
            }
            if (bookmarked) {
                setBookmarked(false);
                await axiosInstance.post("/post/removeBookmark", { postId: post._id });
            } else {
                setBookmarked(true);
                await axiosInstance.post("/post/addBookmark", { postId: post._id });
            }
        } catch (error) {
            console.error("Error liking/disliking post:", error);
        }
    };

    const handleToggleFollow = async (targetUserId: any) => {
        try {
            if (!user) {
                toast.error("Login First");
                return;
            }
            if (isFollowing) {
                setIsFollowing(false);
            } else {
                setIsFollowing(true);
            }
            const response = await axiosInstance.post("/user/follow", {
                targetUserId,
            });
            setUser(response.data.updatedUser);
        } catch (err) {
            console.error("Error toggling follow status:", err);
        }
    };

    useEffect(() => {
        if (post) {
            setIsFollowing(post?.userId?.followers?.includes(user?._id));
        }
    }, [post]);

    const openTipModal = () => {
        if (!user) {
            toast.error("Login First");
            return;
        }
        if (usdcBalance <= 0) {
            toast.error("Deposit USDC");
            return;
        }
        if (!isBiconomySession) {
            toast.error("Create Session first");
            return;
        }
        setShowTipModal(true);
    };

    return (
        <div className="relative">
            {/* <InputForm/> */}
            {user?._id !== post?.userId?._id && (
                <button
                    onClick={handleBookmark}
                    className="cursor-pointer absolute top-4 right-4 text-2xl text-secondary-text"
                >
                    {bookmarked ? <IoCart className="text-blue-500" /> : <IoCartOutline />}
                </button>
            )}
            <div className="z-10 bg-white p-4 min-w-full max-w-md flex flex-col gap-4 border-b border-blue-100">
                <div className="flex gap-3 w-full">
                    {/* {post.forOther ? (
                        <img
                            src={
                                post.forOther
                                    ? post?.otherUserProfile?.profileImage
                                    : post?.createdBy?.farcaster?.pfp || "https://via.placeholder.com/40"
                            }
                            className="h-12 w-12 rounded-full"
                            alt="Profile"
                        />
                    ) : (
                        <img src={post?.userId?.image} className="h-12 w-12 rounded-full" alt="Profile" />
                    )}
                        */}
                    {post.userId?.image ? (
                        <img
                            src={post.userId?.image || "https://via.placeholder.com/40"}
                            className="h-12 w-12 rounded-full"
                            alt="Profile"
                        />
                    ) : (
                        <div className="h-12 w-12">
                            <AvatarIcon address={post?.smartWalletAddress} />
                        </div>
                    )}
                    <div className="flex flex-col h-12 justify-center text-sm">
                        <p className="text-lg text-primary-text font-semibold flex items-center gap-2">
                            <span>{post.forOther ? post.otherUserProfile.profileName : post.userId?.name}</span>
                            {post.forOther && <span className="text-xs">created by</span>}
                            {post.forOther && (
                                <span className="text-base">
                                    (
                                    {post?.userId?.name
                                        ? post?.userId?.name
                                        : shorten(post?.userId?.smartAccountAddress)}
                                    )
                                </span>
                            )}
                        </p>
                        <span className="text-xs text-secondary-text">{postDateFormat(post.createdAt)}</span>
                    </div>
                    <div className="h-12 flex items-center">
                        {post?.userId?._id !== user?._id && (
                            <button
                                className={`px-2 py-1 rounded-xl transition-all duration-300 text-sm ${
                                    isFollowing
                                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                }`}
                                onClick={() => handleToggleFollow(post?.userId?._id)}
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-base text-gray-500">{post.content}</p>
                {post?.imgUrl && <img src={post?.imgUrl} className="rounded-lg w-full lg:w-3/4" />}
                {post.links && post.links.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {post.links.map((link: string, index: number) => (
                            <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                )}
                <div className="flex gap-6 items-center h-8 border-b border-blue-100">
                    <span className="text-secondary-text text-xs">
                        {likeCount} {likeCount > 1 ? "Likes" : "Like"}
                    </span>
                    <span className="text-secondary-text text-xs">
                        {post?.tips?.length} {post?.tips?.length > 1 ? "Tips" : "Tip"}
                    </span>
                    <button className="text-secondary-text text-xs hover:text-primary-text hover:underline cursor-pointer">
                        Tip of {post.totalTips} USDC
                    </button>
                    {/* <div className="text-sm">Tips:</div>
                    <div className="px-2 bg-gray-200 rounded-lg text-sm">1 usdc</div>
                    <div className="px-2 bg-gray-200 rounded-lg text-sm">2 usdc</div>
                    <div className="px-2 bg-gray-200 rounded-lg text-sm">3 usdc</div> */}
                </div>
                <div className="flex gap-4 justify-between items-center">
                    <div className="flex gap-4">
                        <button
                            onClick={handleLike}
                            className="flex gap-2 items-center rounded-lg bg-blue-100 hover:bg-blue-200 px-2 py-1 cursor-pointer transition-all duration-300 text-secondary-text"
                        >
                            {liked ? (
                                <>
                                    <AiFillLike className="text-blue-500" />
                                    <span className="text-xs">Liked</span>
                                </>
                            ) : (
                                <>
                                    <AiOutlineLike />
                                    <span className="text-xs">Like</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={openTipModal}
                            className="flex gap-2 items-center rounded-lg bg-blue-100 hover:bg-blue-200 px-2 py-1 cursor-pointer transition-all duration-300 text-secondary-text"
                        >
                            <PiCoinLight />
                            <span className="text-xs">Tip</span>
                        </button>
                    </div>
                    <div className="flex gap-4 broder w-full">
                        {/* <span className="text-xs">{post.likes.length} Likes</span> */}
                        {/* <span className="text-xs">${post.totalTips} of tips</span> */}
                    </div>
                </div>
                {showTipModal && <TipModal post={post} showTipModal={showTipModal} setShowTipModal={setShowTipModal} />}
            </div>
        </div>
    );
};

export default PostCard;
