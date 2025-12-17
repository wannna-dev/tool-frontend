"use client";
import styles from "./PublishFor.module.scss";
import { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const PublishFor = ({ handlePublishFor }: { handlePublishFor: (communityId: string) => void }) => {

  const { user } = useAppContext();

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPublishFor, setSelectedPublishFor] = useState({ id: "", name: "Everyone", icon: "/svg/feed.svg" });

  const handleSelectPublishFor = (publishFor: { id: string, name: string, icon: string }) => {
    setSelectedPublishFor(publishFor);
    setShowDropdown(false);
    handlePublishFor(publishFor.id);
  };

  return (
    <div className={styles.publishFor}>
      <button className={styles.publishFor__button} data-variant="icon" onClick={() => setShowDropdown(!showDropdown)}>
        <div className={styles.publishFor__button__icon}>
          <Image className={styles.publishFor__button__icon__image} src={selectedPublishFor.icon} alt={selectedPublishFor.name} width={16} height={16} />
          <p>{selectedPublishFor.name}</p>
        </div>
        <Image src="/svg/chevron--down.svg" alt="chevron-down" width={7} height={4} />
      </button>

      {showDropdown && (
        <div className={styles.publishFor__dropdown}>
          <div className={styles.publishFor__dropdown__item} onClick={() => handleSelectPublishFor({ id: "", name: "Everyone", icon: "/svg/feed.svg" })}>
            <div className={styles.publishFor__dropdown__item__header}>
              <Image src="/svg/feed.svg" alt="everyone" width={16} height={16} />
              <p>Everyone</p>
            </div>
          </div>
          {user?.community?.length && user?.community?.length > 0 && user?.community?.map((community) => (
            <div className={styles.publishFor__dropdown__item} key={community.id} onClick={() => handleSelectPublishFor({ id: community.id, name: community.name, icon: community.image })}>
              <div className={styles.publishFor__dropdown__item__header}>
                <Image className={styles.publishFor__dropdown__item__header__image} src={community.image} alt={community.name} width={16} height={16} />
                <p>{community.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublishFor;