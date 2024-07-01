import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import { useLazyQuery, useLazyQueryWithPagination } from "@airstack/airstack-react";
import { init } from "@airstack/airstack-react";
import CustomButton from "./custom/CustomButtons";
import InputForm from "./custom/InputForm";
import { shorten } from "@/utils/constants";
import { DataState } from "@/context/dataProvider";
import { useRouter } from "next/navigation";
import { FaLink } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
init("10414e57f4ac344a787f5d6ad0035ded4");
import { CgSpinner } from "react-icons/cg";
import CopyButton from "./custom/CopyButton";
import { BASE_URL } from "@/utils/keys";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";
import toast from "react-hot-toast";

const UNIVERSAL_RESOLVER = `
query MyQuery($address: Identity!) {
  Wallet(input: {identity: $address, blockchain: ethereum}) {
    identity
    addresses
    primaryDomain {
      name
      isPrimary
    }
    domains(input: {limit: 50}) {
      name
      isPrimary
    }
    socials {
      dappName
      profileName
      profileCreatedAtBlockTimestamp
      userAssociatedAddresses
      profileImage
    }
  }
}
`;

const SocialProfileCard = ({ profile }: any) => {
    const address = profile?.Wallet?.addresses[0];
    const { dappName, profileImage, profileName } = profile?.Wallet?.socials[0];

    const imageUrl = profileImage?.startsWith("ipfs://")
        ? profileImage.replace("ipfs://", "https://ipfs.io/ipfs/")
        : profileImage;

    return (
        <div className="flex gap-2 rounded w-full">
            <img className="h-12 w-12 rounded-full object-cover" src={imageUrl} alt={`${profileName} profile`} />
            <div className="text-sm">
                <div className="font-semibold text-xl">
                    {profileName} ({dappName})
                </div>
                <p className="text-sm capitalize">{address}</p>
            </div>
        </div>
    );
};

const GetEnsProfile = ({ setDappName, setProfileImage, setProfileName, setUserProfile, setUserWalletAddress }: any) => {
    const [inputValue, setInputValue] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [resolveIdentity, { data, loading, error, pagination }] = useLazyQueryWithPagination(UNIVERSAL_RESOLVER);

    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        console.log("data: ", data);
        if (data?.Wallet != null) {
            setShowModal(true);
            const address = data?.Wallet?.addresses[0];
            const { dappName, profileImage, profileName } = data?.Wallet?.socials[0];

            const imageUrl = profileImage.startsWith("ipfs://")
                ? profileImage.replace("ipfs://", "https://ipfs.io/ipfs/")
                : profileImage;

            setUserWalletAddress(address);
            setDappName(dappName);
            setProfileImage(imageUrl);
            setProfileName(profileName);
            setUserProfile(data);
        }
    }, [data]);

    const handleSubmit = async () => {
        console.log("Input value:", inputValue);
        await resolveIdentity?.({ address: inputValue });
        setInputValue("");
    };

    return (
        <div className="flex flex-col justify-center items-center mb-2 w-full">
            <div className="flex items-center gap-2 w-full">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-blue-100 outline-none rounded-md w-full focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Seach ENS Profile for Tip..."
                />
                <CustomButton onClick={handleSubmit} disabled={loading}>
                    {loading ? "Loading..." : "Search"}
                </CustomButton>
            </div>
        </div>
    );
};

const CreatePost: React.FC = () => {
    const { getAccessToken } = usePrivy();
    const router = useRouter();
    const { smartAccountAddress } = DataState();
    const [showLinkSelection, setShowLinkSelection] = useState<boolean>(false);

    const [content, setContent] = useState("");
    const [link, setLink] = useState("");
    const [links, setLinks] = useState<string[]>([]);
    const [forOther, setForOther] = useState(false);
    const [dappName, setDappName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [profileName, setProfileName] = useState("");
    const [smartWalletAddress, setSmartWalletAddress] = useState("");
    const [userProfile, setUserProfile] = useState(null);
    const [userWalletAddress, setUserWalletAddress] = useState(null);
    const [postSending, setPostSending] = useState<boolean>(false);

    const { result, uploader }: any = useDisplayImage();
    const [imgUrl, setImgUrl] = useState<string>("");
    const [uploadImageLoading, setUploadImageLoading] = useState<boolean>(false);
    const imageRef = useRef(null);

    const handleAddLink = () => {
        if (link && links.length < 5) {
            setLinks([...links, link]);
            setLink("");
        }
    };

    const handleRemoveLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setPostSending(true);
            const postData = {
                // userId: "YOUR_USER_ID", // Replace with actual user ID
                content,
                links: links || [],
                forOther,
                otherUserProfile: forOther ? { dappName, profileImage, profileName } : null,
                smartWalletAddress: forOther ? userWalletAddress : smartAccountAddress,
                imgUrl: imgUrl,
                tips: [], // Initial tips array
            };

            // const response = await axiosInstance.post("/post", postData);
            const accessToken = await getAccessToken();
            const response = await axios.post(`${BASE_URL}/post`, postData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await response.data;

            if (data.success) {
                router.push("/");
                // Handle successful post creation
                setPostSending(false);
                console.log("Post created successfully:", data.data);
            }
        } catch (error) {
            setPostSending(false);
            console.error("Error:", error);
        }
    };

    function useDisplayImage() {
        const [result, setResult] = useState(false);

        function uploader(e: any) {
            const imageFile = e.target.files[0];

            if (imageFile.size > 400 * 1024) {
                toast.error("Image size should be less than 400 KB");
                return;
            }

            const reader: any = new FileReader();
            reader.addEventListener("load", (e: any) => {
                setResult(e.target.result);
            });

            reader.readAsDataURL(imageFile);
        }

        return { result, uploader };
    }

    const handleProfilePic = async () => {
        try {
            setUploadImageLoading(true);
            const formData: any = new FormData();
            formData.append("picture", result);

            // const response = await axiosInstance.put(`/post/upload-img`, formData);
            const accessToken = await getAccessToken();
            const response = await axios.put(`${BASE_URL}/post/upload-img`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 200) {
                setImgUrl(response.data.url);
            }
            setUploadImageLoading(false);
        } catch (error) {
            console.error(error);
            setUploadImageLoading(false);
        }
    };

    useEffect(() => {
        if (result) {
            handleProfilePic();
        }
    }, [result]);
    return (
        <div
            // onSubmit={handleSubmit}
            className="w-full mx-auto p-4 bg-white rounded-2xl border border-blue-100 max-w-md mt-10"
        >
            {forOther && (
                <div className="mb-4">
                    <div className="flex flex-col gap-2 mb-4">
                        <GetEnsProfile
                            setDappName={setDappName}
                            setProfileImage={setProfileImage}
                            setProfileName={setProfileName}
                            setUserProfile={setUserProfile}
                            setUserWalletAddress={setUserWalletAddress}
                        />
                        {userProfile && <SocialProfileCard profile={userProfile} />}
                    </div>
                </div>
            )}

            <div className="mb-4">
                <label className="block text-gray-700">Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 resize-none"
                    maxLength={2000}
                    rows={5}
                />
                <div className="text-right text-gray-600">
                    {content.length}/{2000}
                </div>
            </div>
            {/* <div className="mb-4 flex gap-3">
                <div>{imgUrl !== "" && <img ref={imageRef} src={imgUrl} className="w-full mx-auto rounded-lg" />}</div>
            </div>
            <div className="mb-4 flex gap-3">
                <button
                    className="h-10 w-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-secondary-text"
                    onClick={() => setShowLinkSelection(true)}
                >
                    <FaLink />
                </button>
                <div className="">
                    <button className="h-10 w-10 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-secondary-text relative flex items-center justify-center cursor-pointer overflow-hidden">
                        <FaRegImage />
                        <div className="absolute h-20 w-10 bottom-0 left-0 cursor-pointer">
                            <input
                                type="file"
                                name="image"
                                onChange={(e) => uploader(e)}
                                className="h-full w-10 opacity-25 cursor-pointer"
                            />
                        </div>
                    </button>
                </div>
            </div> */}
            <div>
                <div className="mb-4 flex gap-3">
                    {uploadImageLoading ? (
                        <div className="w-full h-52 flex flex-col gap-3 items-center justify-center">
                            <CgSpinner className="animate-spin h-5 w-5" />
                            <span className="text-sm text-secondary-text">Uploading...</span>
                        </div>
                    ) : (
                        <div>{imgUrl && <img src={imgUrl} className="w-full mx-auto rounded-lg" alt="Uploaded" />}</div>
                    )}
                </div>
                <div className="mb-4 flex gap-3">
                    <button
                        className="h-10 w-10 flex items-center justify-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-secondary-text"
                        onClick={() => setShowLinkSelection(true)}
                    >
                        <FaLink />
                    </button>
                    <div>
                        <button className="h-10 w-10 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-secondary-text relative flex items-center justify-center cursor-pointer overflow-hidden">
                            <FaRegImage />
                            <div className="absolute h-20 w-10 bottom-0 left-0 cursor-pointer">
                                <input
                                    type="file"
                                    name="image"
                                    onChange={(e) => uploader(e)}
                                    className="h-full w-10 opacity-25 cursor-pointer"
                                />
                            </div>
                        </button>
                    </div>
                </div>
                {/* {uploadImageLoading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-width duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                )} */}
            </div>

            {showLinkSelection && (
                <div className="mb-4">
                    <label className="block text-gray-700">Links:</label>
                    <div className="flex items-center mb-2">
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button
                            type="button"
                            onClick={handleAddLink}
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {links.map((link, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-full"
                            >
                                <span>{shorten(link)}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLink(index)}
                                    className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="mb-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={forOther}
                    onChange={(e) => setForOther(e.target.checked)}
                    className="cursor-pointer"
                />
                <label className="text-gray-700 text-sm">Create post for someone</label>
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                disabled={postSending}
                onClick={handleSubmit}
            >
                Create Post
            </button>
        </div>
    );
};

export default CreatePost;
