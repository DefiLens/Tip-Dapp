"use client";
import AvatarIcon from "@/components/Avatar";
import CustomButton from "@/components/custom/CustomButtons";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import { DataState } from "@/context/dataProvider";
import axiosInstance from "@/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { CgSpinner } from "react-icons/cg";
import { useRouter } from "next/navigation";

const page = () => {
    const { user, isGettingUserData, setUser } = DataState();
    const { result, uploader }: any = useDisplayImage();
    const [imgUrl, setImgUrl] = useState<string>(user?.image || "");
    const [uploadImageLoading, setUploadImageLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>(user?.name || "");
    const [bio, setBio] = useState<string>(user?.bio || "");
    const router = useRouter();
    useEffect(() => {
        setImgUrl(user?.image);
        setName(user?.name);
        setBio(user?.bio);
    }, [user]);

    function useDisplayImage() {
        const [result, setResult] = useState(false);

        function uploader(e: any) {
            const imageFile = e.target.files[0];

            const reader = new FileReader();
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
            const formData = new FormData();
            formData.append("picture", result);

            const response = await axiosInstance.put(`/post/upload-img`, formData);

            if (response.status === 200) {
                setImgUrl(response.data.url);
            }
            setUploadImageLoading(false);
        } catch (error) {
            console.error(error);
            setUploadImageLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const response = await axiosInstance.put("/user/update-info", { name, bio, image: imgUrl });

            if (response.status === 200) {
                setUser(response.data.user);
                router.push("/profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    useEffect(() => {
        if (result) {
            handleProfilePic();
        }
    }, [result]);

    return (
        <NavigationLayout>
            {uploadImageLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                    <div className="rounded-2xl relative">
                        <CgSpinner className="animate-spin h-12 w-12 text-white" />
                    </div>
                </div>
            )}
            {isGettingUserData ? (
                <></>
            ) : (
                <div className="flex flex-col items-center gap-5 w-full py-4 px-2">
                    <div className="relative">
                        {imgUrl ? (
                            <img src={imgUrl} className="h-40 w-40 rounded-full" alt="Profile" />
                        ) : user?.image ? (
                            <img src={user?.image} className="h-40 w-40 rounded-full" alt="Profile" />
                        ) : (
                            <div className="h-40 w-40">
                                <AvatarIcon address={user?.smartAccountAddress} />
                            </div>
                        )}
                        <button className="h-7 w-7 bg-fuchsia-50 hover:bg-fuchsia-100 rounded-full transition-all duration-300 text-secondary-text flex items-center justify-center cursor-pointer overflow-hidden absolute bottom-1 right-3 border-4 border-white">
                            <IoMdCreate />
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

                    <div className="mb-4 w-full">
                        <label className="block text-gray-700">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-fuchsia-300 w-full"
                        />
                    </div>
                    <div className="mb-4 w-full">
                        <label className="block text-gray-700">Bio:</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-fuchsia-300 resize-none"
                            maxLength={500}
                            rows={4}
                        />
                        <div className="text-right text-gray-600">
                            {bio?.length}/{500}
                        </div>
                    </div>
                    <div className="">
                        <CustomButton onClick={handleSaveProfile}>Save</CustomButton>
                    </div>
                </div>
            )}
        </NavigationLayout>
    );
};

export default page;
