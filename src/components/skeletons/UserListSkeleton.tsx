const UserListSkeleton = () => {
    return (
        <div className="flex items-center gap-5 w-full">
            <div className="h-10 w-10 rounded-full animate-pulse bg-fuchsia-50"></div>
            <div className="h-8 rounded-lg flex-1 animate-pulse bg-fuchsia-50"></div>
        </div>
    );
};

export default UserListSkeleton;
