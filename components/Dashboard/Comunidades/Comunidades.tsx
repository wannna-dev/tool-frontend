import styles from "./Comunidades.module.scss";
import { useState, useEffect } from "react";
import { CommunityType } from "@/types/community";
import { getCommunitiesOfUser } from "@/lib/community-actions";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";

const Comunidades = () => {
    const { user } = useAppContext();
    const [communities, setCommunities] = useState<CommunityType[]>([]);

    useEffect(() => {
        const fetchCommunities = async () => {
            if (!user?.id) return;
            const data = await getCommunitiesOfUser(user?.id);
            setCommunities(data as CommunityType[]);
        }
        fetchCommunities();
    }, [user?.id]);

    return (
        <div className={styles.comunidades}>
          <div className={styles.comunidades__container}>
            <h1 className={styles.comunidades__title}>Tus comunidades</h1>

            {communities && communities.length > 0 && communities.map((community) => (
                <Link href={`/c/${community.id}`} key={community.id} className={styles.comunidades__community}>
                  <Image className={styles.comunidades__community__image} src={community.image} alt={community.name} width={100} height={100} loading="lazy" />
                  <div className={styles.comunidades__community__info}>
                    <h2>{community.name}</h2>
                    <p>{community.description}</p>
                  </div>
                  
                </Link>
            ))}
          </div>
        </div>
    );
};

export default Comunidades;