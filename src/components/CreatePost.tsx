import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { useLazyQuery, useLazyQueryWithPagination } from "@airstack/airstack-react";
import { init } from "@airstack/airstack-react";
import CustomButton from "./custom/CustomButtons";
import InputForm from "./custom/InputForm";
import { shorten } from "@/utils/constants";
import { DataState } from "@/context/dataProvider";
import { useRouter } from "next/navigation";

init("10414e57f4ac344a787f5d6ad0035ded4");

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
                    className="px-4 py-2 border border-purple-100 outline-none rounded-md w-full focus:outline-none focus:ring focus:ring-purple-300"
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
    const router = useRouter();
    const { smartAccountAddress } = DataState();

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

        const postData = {
            // userId: "YOUR_USER_ID", // Replace with actual user ID
            content,
            links,
            forOther,
            otherUserProfile: forOther ? { dappName, profileImage, profileName } : null,
            smartWalletAddress: forOther ? userWalletAddress : smartAccountAddress,
            tips: [], // Initial tips array
        };

        try {
            const response = await axiosInstance.post("/user/post", postData);

            const data = await response.data;

            if (data.success) {
                router.push("/")
                // Handle successful post creation
                console.log("Post created successfully:", data.data);
            } else {
                // Handle error in post creation
                console.error("Error creating post:", data.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full mx-auto p-4 bg-white rounded-lg shadow-md">
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
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300 resize-none"
                    maxLength={500}
                    rows={5}
                />
                <div className="text-right text-gray-600">
                    {content.length}/{500}
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Links:</label>
                <div className="flex items-center mb-2">
                    <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                    />
                    <button
                        type="button"
                        onClick={handleAddLink}
                        className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {links.map((link, index) => (
                        <div key={index} className="flex items-center bg-purple-200 text-purple-700 px-3 py-1 rounded-full">
                            <span>{shorten(link)}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveLink(index)}
                                className="ml-2 text-purple-500 hover:text-purple-700 focus:outline-none"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-4 flex items-center gap-2">
                <input type="checkbox" checked={forOther} onChange={(e) => setForOther(e.target.checked)} />
                <label className="text-gray-700 text-sm">Create post for someone</label>
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
            >
                Create Post
            </button>
        </form>
    );
};

export default CreatePost;
