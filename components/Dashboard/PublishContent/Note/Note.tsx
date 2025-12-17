"use client";
import styles from "./Note.module.scss";
import Image from "next/image";
import { useState } from "react";
import { createNote } from "@/lib/note-actions";
import { useAppContext } from "@/context/AppContext";
import PublishFor from "@/components/PublishFor/PublishFor";
import PublishAs from "@/components/PublishAs/PublishAs";

type TabType = "" | "note" | "post" | "question";

const Note = ({ handleTabChange }: { handleTabChange: (tab: TabType) => void }) => {

  const { setToast, user } = useAppContext();

    const [text, setText] = useState("");
    const [publishAs, setPublishAs] = useState<string>("");
    const [publishAsAnonymous, setPublishAsAnonymous] = useState<boolean>(false);
    const maxLength = 150;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (text.trim()) {
            // Do something with the note text
            console.log("Note submitted:", text);

            const data = await createNote(text, publishAs, publishAsAnonymous);
            console.log(data)

            if (data.success) {
              setToast({
                show: true,
                message: "Nota publicada correctamente",
                type: "success",
              });
            } else {
              setToast({
                show: true,
                message: data.error || "Error al publicar la nota",
                type: "error",
              });
            }
            // Reset and close
            setText("");
            handleTabChange("");
        }
    };

    const handlePublishFor = (communityId: string) => {
      setPublishAs(communityId);
    };

    const handlePublishAs = (isAnonymous: boolean) => {
      setPublishAsAnonymous(isAnonymous);
    };

    return (
        <div className={styles.note}>
            <div className={styles.note__bg} onClick={() => handleTabChange("")} />

            <div className={styles.note__modal}>
              <div className={styles.note__modal__header}>
                <p className={styles.note__modal__header__title}>Nota / Reflexión</p>
                <button
                  data-variant="icon"
                  type="button"
                  onClick={() => handleTabChange("")}
                >
                  <Image src="/svg/close.svg" alt="close" width={16} height={16} />
                </button>
              </div>

              <div className={styles.note__modal__settings}>
                <PublishFor handlePublishFor={handlePublishFor} />
                <PublishAs handlePublishAs={handlePublishAs} />
              </div>

              <form className={styles.note__modal__form} onSubmit={handleSubmit}>
                <div className={styles.note__modal__form__content}>
                  <textarea 
                    id="title" 
                    placeholder="Idea brillante a las 3 AM. Yo del futuro: de nada" 
                    rows={5}
                    maxLength={maxLength}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <div className={styles.note__modal__form__content__counter}>
                    {text.length}/{maxLength}
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className={styles.note__modal__form__submit}
                  disabled={!text.trim()}
                >
                  Publicar
                </button>
              </form>
            </div>
        </div>
    );
};

export default Note;