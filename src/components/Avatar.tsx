import Avatar from "boring-avatars";

const AvatarIcon = ({ address }: { address: string }) => (
    <Avatar
        size="100%"
        name={address}
        variant="marble"
        colors={["#92A1C6", "#1f2020", "#F0AB3D", "#C271B4", "#C20D90"]}
    />
);

export default AvatarIcon;
