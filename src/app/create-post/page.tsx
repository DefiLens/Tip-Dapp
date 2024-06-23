"use client";
import CreatePost from "@/components/CreatePost";
import NavigationLayout from "@/components/layouts/NavigationLayout";
import React from "react";

const page = () => {
    return (
        <NavigationLayout>
            <CreatePost />
        </NavigationLayout>
    );
};

export default page;
