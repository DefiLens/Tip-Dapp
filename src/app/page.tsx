"use client";
import PostList from "@/components/PostList";
import NavigationLayout from "@/components/layouts/NavigationLayout";


const MainLayout = () => {
    return (
        <NavigationLayout>
            <PostList />
        </NavigationLayout>
    );
};

export default MainLayout;
