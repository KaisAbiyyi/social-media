import { FC } from "react";

interface ProfilePageProps {
    params: {
        username: string
    }
}

const ProfilePage: FC<ProfilePageProps> = ({ params }) => {
    return (
        <h1>{params.username}</h1>
    );
}

export default ProfilePage;