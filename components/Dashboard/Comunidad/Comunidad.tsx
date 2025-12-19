import styles from "./Comunidad.module.scss";
import { useState, useEffect } from "react";
import { CommunityType } from "@/types/community";
import { getCommunity } from "@/lib/community-actions";
import { redirect } from "next/navigation";
import Image from "next/image";
import { NoteType } from "@/types/note";
import { QuestionType } from "@/types/question";
import NoteCard from "../Muro/NoteCard/NoteCard";

const Comunidad = ({ communityId }: { communityId?: string }) => {
    const [community, setCommunity] = useState<CommunityType | null>(null);

    useEffect(() => {
        const fetchCommunity = async () => {
            if (!communityId) return;
            const data = await getCommunity(communityId);
            console.log("🚀 data:", data);
            if (!data) return redirect("/");
            setCommunity(data as unknown as CommunityType);
        }
        fetchCommunity();
    }, [communityId]);

    return (
        <div className={styles.comunidades}>
          <div className={styles.comunidades__container}>
            
            <div className={styles.comunidades__container__header}>
              <Image className={styles.comunidades__container__header__image} src={community?.image || ""} alt={community?.name || ""} width={100} height={100} />
              <div className={styles.comunidades__container__header__content}>
                <p className={styles.comunidades__container__header__content__name}>{community?.name}</p>
                <p className={styles.comunidades__container__header__content__description}>{community?.description}</p>
              </div>
            </div>

            <div className={styles.comunidades__container__content}>
              <h2 className={styles.comunidades__container__content__title}>Notas</h2>
              <div className={styles.comunidades__container__content__notes}>
                {community?.notes.map((note: NoteType) => (
                  <div className={styles.comunidades__container__content__note} key={note.id}>
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.comunidades__container__content}>
              <h2 className={styles.comunidades__container__content__title}>Preguntas</h2>
              <div className={styles.comunidades__container__content__questions}>
                {community?.questions.map((question: QuestionType) => (
                  <div className={styles.comunidades__container__content__question} key={question.id}>
                    <p>{question.question}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
    );
};

export default Comunidad;