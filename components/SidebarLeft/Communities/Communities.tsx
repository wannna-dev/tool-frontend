import styles from "./Communities.module.scss";
import { CommunityType } from "@/types/community";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";


const Communities = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { user } = useAppContext();
  const communities = (user?.community ?? []) as CommunityType[];

  return (
      <div className={styles.communities}>
          {communities.length > 0 && (
            <>
                <p className={`${styles.communities__title} ${isCollapsed ? styles.communities__title__collapsed : ""}`}>Mis comunidades</p>
                {communities.map((community) => (
                    <Link href={`/c/${community.id}`} key={community.id} className={`${styles.communities__item} ${isCollapsed ? styles.communities__item__collapsed : ""}`}>
                        <Image className={`${styles.communities__item__image} ${isCollapsed ? styles.communities__item__image__collapsed : ""}`} src={community.image} alt={community.name} width={100} height={100} loading="lazy" />
                        <p className={styles.communities__item__name}>{community.name}</p>
                    </Link>
                ))}
            </>
          )}
      </div>
  );
};

export default Communities;