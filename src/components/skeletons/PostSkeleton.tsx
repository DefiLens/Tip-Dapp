import React from "react";

const PostSkeleton = () => {
    return (
        <div className="bg-white p-4 min-w-full max-w-md flex flex-col gap-4 border-b border-blue-100">
            <div className="flex gap-4 w-full">
                <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200"></div>
                <div className="flex flex-col h-12 justify-center gap-1">
                    <p className="h-4 rounded-lg w-28 bg-gray-200"></p>
                    <span className="h-4 rounded-lg w-40 bg-gray-200"></span>
                </div>
            </div>
            <div className="pl-16 flex flex-col gap-2">
                <div className="animate-pulse bg-gray-200 h-4 w-5/12 rounded-full"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-3/12 rounded-full"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-6/12 rounded-full"></div>
                <div className="animate-pulse bg-gray-200 h-4 rounded-full w-11/12"></div>
                <div className="animate-pulse bg-gray-200 h-4 rounded-full w-8/12"></div>
                <div className="animate-pulse bg-gray-200 h-4 rounded-full w-9/12"></div>
            </div>
            <div className="pl-16 flex gap-6 items-center h-8 border-b border-blue-100">
                <span className="h-3 bg-gray-200 w-12 rounded-lg"></span>
                <span className="h-3 bg-gray-200 w-12 rounded-lg"></span>
                <span className="h-3 bg-gray-200 w-12 rounded-lg"></span>
            </div>
            <div className="pl-16 flex gap-4 justify-between items-center">
                <div className="flex gap-4">
                    <div className="h-5 w-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default PostSkeleton;
