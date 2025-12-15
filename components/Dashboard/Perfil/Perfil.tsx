import styles from "./Perfil.module.scss";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { PostType } from "@/types/post";
import Image from "next/image";
import { redirect } from "next/navigation";
import EditProfile from "./EditProfile/EditProfile";
import { useAppContext } from "@/context/AppContext";
interface UserProfileType {
    id: string;
    username: string;
    avatar_url: string;
    full_name: string;
    bio: string;
    date_of_birth: string;
    location: string;
    picture: string;
    posts: PostType[];
}

async function getPostsOfUser(username: string) {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from('profiles')
        .select(`
            *,
            posts (
                id,
                image,
                title,
                description,
                created_at
            )
        `)
        .eq('username', username)
        .single();

    if (error) {
        console.error("Error fetching posts:", error);
        redirect('/');
        return null;
    }
    return data;
}

const Perfil = ({usernameProfile}: {usernameProfile?: string}) => {

    const user = useAppContext();

    // states
    const [userProfile, setUserProfile] = useState<UserProfileType>();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isUserOwner, setIsUserOwner] = useState(false);


    useEffect(() => {
        const fetchPostsOfUser = async () => {
            const data = await getPostsOfUser(usernameProfile || '');
            console.log("🚀 data:", data);
            setUserProfile(data)
            setIsUserOwner(data.id === user.user?.id);
        }
        if (usernameProfile) {
            fetchPostsOfUser();
        }
    }, [usernameProfile, user.user?.id]);


    return (
        <div className={styles.perfil}>
            {userProfile && (
                <div className={styles.perfil__container}>
                    <div className={styles.perfil__header}>
                        
                        <div className={`${styles.perfil__header__avatar} ${isUserOwner ? styles.perfil__header__avatar__owner : ''}`} style={{ backgroundImage: `url("${userProfile.picture}")` }} onClick={() => isUserOwner ? setIsEditingProfile(true) : null}>
                            {isUserOwner && (
                                <Image className={styles.perfil__header__avatar__edit} src="/svg/edit.svg" alt="Edit" width={20} height={20} />
                            )}
                        </div>

                        <h2 className={styles.perfil__header__fullname}>{userProfile.full_name}</h2>
                        <p className={styles.perfil__header__username}>@{userProfile.username}</p>
                        <p className={styles.perfil__header__bio}>{userProfile.bio}</p>
                    </div>
                    <div className={styles.perfil__posts}>
                        { userProfile.posts && userProfile.posts.map((post: PostType) => (
                            <div key={post.id} className={styles.perfil__post}>
                                <Image className={styles.perfil__post__image} src={post.image} alt={post.title} width={300} height={300} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edit Profile */}
            {isEditingProfile && userProfile && <EditProfile userProfile={userProfile} setIsEditingProfile={setIsEditingProfile} />}
        </div>
    );
};

export default Perfil;