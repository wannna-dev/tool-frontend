import styles from "./Communities.module.scss";
import { CommunityType } from "@/types/community";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";


const Communities = () => {
  const { user } = useAppContext();
  const communities = (user?.community ?? []) as CommunityType[];

  return (
      <div className={styles.communities}>
          {communities.length > 0 && (
            <>
                <p className={styles.communities__title}>Mis comunidades</p>
                {communities.map((community) => (
                    <Link href={`/c/${community.id}`} key={community.id} className={styles.communities__item}>
                        <Image className={styles.communities__item__image} src={community.image} alt={community.name} width={100} height={100} loading="lazy" />
                        <p className={styles.communities__item__name}>{community.name}</p>
                    </Link>
                ))}
            </>
          )}
      </div>
  );
};

export default Communities;