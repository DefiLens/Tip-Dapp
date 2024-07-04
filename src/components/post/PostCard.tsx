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
import axios from "axios";
import { BASE_URL } from "@/utils/keys";
import { usePrivy } from "@privy-io/react-auth";
import { IoIosArrowBack, IoIosArrowDropleftCircle, IoIosArrowDroprightCircle, IoIosArrowForward } from "react-icons/io";
import { HiBadgeCheck } from "react-icons/hi";

interface PostCardProps {
    post: IPost;
}
const ImageGallery = ({ images }: any) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleImageClick = (index) => {
        setSelectedImage(images[index]);
        setCurrentIndex(index);
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
            setSelectedImage(images[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setSelectedImage(images[currentIndex + 1]);
        }
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    return (
        <div className="w-full flex justify-center items-center">
            <div className="relative w-full max-w-5xl">
                <img src={selectedImage} alt="Selected" className="max-h-screen rounded-xl" />
                {currentIndex > 0 && (
                    <button
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-lg font-bold bg-white p-0.5 rounded-full"
                        onClick={handlePrevious}
                    >
                        <IoIosArrowBack className="text-black" />
                    </button>
                )}
                {currentIndex < images.length - 1 && (
                    <button
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-lg font-bold bg-white p-0.5 rounded-full"
                        onClick={handleNext}
                    >
                        <IoIosArrowForward className="text-black" />
                    </button>
                )}
            </div>
        </div>
    );
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { getAccessToken } = usePrivy();
    const { user, setUser, usdcBalance, isBiconomySession } = DataState();
    const [showTipModal, setShowTipModal] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(post?.likes?.length);

    const [liked, setLiked] = useState<boolean>(post?.likes?.includes(user?._id));
    const [bookmarked, setBookmarked] = useState(post?.bookmarks?.includes(user?._id));
    const [totalTipAmount, setTotalTipAmount] = useState<number>(post?.totalTips);
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
                // await axiosInstance.post("/post/dislikePost", { postId: post._id });
                const accessToken = await getAccessToken();
                await axios.post(
                    `${BASE_URL}/post/dislikePost`,
                    { postId: post._id },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
            } else {
                setLiked(true);
                setLikeCount(likeCount + 1);
                // await axiosInstance.post("/post/likePost", { postId: post._id });
                const accessToken = await getAccessToken();
                await axios.post(
                    `${BASE_URL}/post/likePost`,
                    { postId: post._id },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
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
            const accessToken = await getAccessToken();

            if (bookmarked) {
                setBookmarked(false);
                // await axiosInstance.post("/post/removeBookmark", { postId: post._id });
                await axios.post(
                    `${BASE_URL}/post/removeBookmark`,
                    { postId: post._id },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
            } else {
                setBookmarked(true);
                // await axiosInstance.post("/post/addBookmark", { postId: post._id });
                await axios.post(
                    `${BASE_URL}/post/addBookmark`,
                    { postId: post._id },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
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
            // const response = await axiosInstance.post("/user/follow", {
            //     targetUserId,
            // });

            const accessToken = await getAccessToken();
            const response = await axios.post(
                `${BASE_URL}/user/follow`,
                {
                    targetUserId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

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

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="relative">
            {user?._id !== post?.userId?._id && (
                <button
                    onClick={handleBookmark}
                    className="cursor-pointer absolute top-4 right-4 text-2xl text-secondary-text"
                >
                    {bookmarked ? <FaBookmark className="text-blue-500" /> : <FaRegBookmark />}
                </button>
            )}
            <div className="z-10 bg-white p-4 min-w-full max-w-md flex flex-col gap-4 border-b border-blue-100">
                <div className="flex gap-4 w-full">
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
                            <span className="flex items-center gap-1">
                                {post.forOther ? post.otherUserProfile.profileName : post.userId?.name}
                                {post?.userId?.isFarcasterLinked && <HiBadgeCheck className="text-blue-600 text-xl" />}
                            </span>

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
                <div className="pl-16 flex flex-col gap-4">
                    {/* <pre className="text-base text-gray-500 whitespace-pre-wrap font-sans">{post.content}</pre> */}
                    <div className="text-base text-gray-700 whitespace-pre-wrap font-sans">
                        {isExpanded
                            ? post?.content
                            : post?.content.slice(0, 400) + (post?.content.length > 400 ? "..." : "")}
                        {post?.content.length > 400 && (
                            <button onClick={toggleExpanded} className="text-blue-500 text-xs ml-2">
                                {isExpanded ? "Show less" : "Read more"}
                            </button>
                        )}
                    </div>
                    {/* <div className="grid grid-cols-2 gap-3">
                        {post?.imgUrl &&
                            post?.imgUrl?.map((item: string, index: number) => (
                                <img key={index} src={item} className="rounded-lg w-full" />
                            ))}
                    </div> */}
                    <ImageGallery images={post && post?.imgUrl} />
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
                        <span className="text-primary-text text-xs">
                            {likeCount} {likeCount > 1 ? "Likes" : "Like"}
                        </span>
                        <span className="text-primary-text text-xs">
                            {post?.tips?.length} {post?.tips?.length > 1 ? "Tips" : "Tip"}
                        </span>
                        <button className="text-primary-text text-xs hover:text-primary-text hover:underline cursor-pointer">
                            {/* Tip of {post.totalTips} USDC */}
                            Tip of {totalTipAmount} USDC
                        </button>
                    </div>
                    <div className="flex gap-4 justify-between items-center">
                        <div className="flex gap-4">
                            <button
                                onClick={handleLike}
                                className="flex gap-2 items-center rounded-lg bg-blue-100 hover:bg-blue-200 px-2 py-1 cursor-pointer transition-all duration-300 text-primary-text text-xl"
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
                                className="flex gap-2 items-center rounded-lg bg-blue-100 hover:bg-blue-200 px-2 py-1 cursor-pointer transition-all duration-300 text-primary-text text-xl"
                            >
                                <PiCoinLight />
                                <span className="text-xs">Tip</span>
                            </button>
                        </div>
                    </div>
                </div>
                {showTipModal && (
                    <TipModal
                        post={post}
                        showTipModal={showTipModal}
                        setShowTipModal={setShowTipModal}
                        setTotalTipAmount={setTotalTipAmount}
                    />
                )}
            </div>
        </div>
    );
};

export default PostCard;
