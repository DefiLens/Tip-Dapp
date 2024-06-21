"use client";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import PostCard from "@/components/post/PostCard";
import axiosInstance from "@/utils/axiosInstance";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { useEffect, useState } from "react";

const CreatePost = () => {
    const [content, setContent] = useState("");
    const [userId, setUserId] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/user/post", { content, userId }, { withCredentials: true });
            console.log("Post created successfully:", response.data);
            // Clear the input field after successful submission
            setContent("");
            setUserId("");
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <div className="flex justify-center items-center w-full">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full">
                {/* <InputForm /> */}
                <div className="">
                    <div className="flex gap-2">
                        <img
                            src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/20ea16ea-d8b9-4a95-7d3b-512cf9f9f900/original"
                            className="h-10 w-10 rounded-full"
                        />
                        <div className="mb-4 w-full">
                            <textarea
                                className="w-full px-3 py-2 border h-28 resize-none outline-none border-sky-100 rounded-xl text-gray-600 placeholder:text-gray-400"
                                placeholder="What's on your mind?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {/* <div className="mb-4">
                        <label>Tag Someone</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded"
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        />
                    </div> */}
                    <div className="w-full flex gap-4 items-center justify-end">
                        <button
                            type="submit"
                            className="bg-sky-500 text-white py-1 px-4 rounded-lg hover:bg-sky-600 transition duration-200 text-sm font-semibold"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

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
            <CreatePost />
            {posts.map((post: any, index) => (
                <PostCard key={index} post={post} />
            ))}
        </div>
    );
};

const MainLayout = () => {
    const { user, getAccessToken } = usePrivy();

    const api = axios.create({
        baseURL: "http://localhost:9090", // Adjust the base URL according to your backend URL
        withCredentials: true, // This ensures that cookies are sent with requests
    });

    const call = async () => {
        try {
            const response = await api.get("/api/user/post");
            console.log("response: ", response);
        } catch (err) {
            console.log("ERROR");
        }
    };

    return (
        <NavigationLayout>
            <Posts />
        </NavigationLayout>
    );
};

export default MainLayout;
// <main>
//     {/* <Header />
//     <CreatePost />
//     <Posts />
//     <InputForm /> */}
//     {/* <CustomButton onClick={call}>call</CustomButton> */}

//     {/* <section className="relative">
//         <img
//             src="https://img.freepik.com/premium-vector/modern-abstract-blue-line-dark-background_104237-195.jpg?w=1060"
//             alt="Hero Background"
//             className="w-full h-screen object-cover"
//         />
//         <div className="absolute inset-0 bg-black opacity-80"></div>
//         <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
//             <h1 className="text-5xl font-bold mb-4">Explore Onchain Tip</h1>
//         </div>
//     </section> */}
//     {/* <textarea
//         value={JSON.stringify(user, null, 2)}
//         className="mt-2 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50 sm:text-sm"
//         rows={JSON.stringify(user, null, 2).split("\n").length}
//         disabled
//     /> */}
// </main>
// <main className="h-screen w-screen relative">
//     <div className="relative max-w-6xl w-full h-full mx-auto flex">
//         <Sidebar />
//         <div className="flex-1 h-full overflow-y-auto">
//             <Posts />
//         </div>
//         <div className="hidden md:block w-60 h-full fixed top-0 right-0 bg-white border-l border-gray-300">
//             {/* Add your right sidebar content here */}
//         </div>
//     </div>
// </main>
