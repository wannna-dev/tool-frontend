"use client";
import styles from "./PublishContent.module.scss";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// components
import Note from "./Note/Note";
// import Post from "./Post/Post";
import Question from "./Question/Question";
import { useRouter } from "next/navigation";

type TabType = "" | "note" | "post" | "question";

const PublishContent = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("");

  const publishRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (publishRef.current && !publishRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTabChange = (tab: TabType) => {
    if (tab === "post") {
      router.push("/publish");
    } else {
      setActiveTab(tab);
      setIsOpen(false);
    }
    setActiveTab(tab);
    setIsOpen(false);
  };
  
  return (
    <>
      <div className={styles.publish} ref={publishRef}>
        <button className={styles.publish__button} id="publish-content-button" onClick={() => setIsOpen(!isOpen)}>
          Publicar
          <Image src="/svg/plus-white.svg" alt="plus" width={12} height={12} />
        </button>

        {isOpen && (
          <div className={styles.publish__selector}>
            <button className={styles.publish__selector__button} data-variant="icon" onClick={() => handleTabChange("note")}>
              <Image src="/svg/note.svg" alt="note" width={24} height={24} />
              Nota/Reflexión
            </button>
            <button className={styles.publish__selector__button} data-variant="icon" onClick={() => handleTabChange("post")}>
              <Image src="/svg/post.svg" alt="post" width={24} height={24} />
              Post/Experiencia
            </button>
            <button className={styles.publish__selector__button} data-variant="icon" onClick={() => handleTabChange("question")}>
              <Image src="/svg/question.svg" alt="question" width={24} height={24} />
              Pregunta
            </button>
          </div>
        )}
      </div>

      {activeTab === "note" && <Note handleTabChange={handleTabChange} />}
      {/* {activeTab === "post" && <Post />} */}
      {activeTab === "question" && <Question handleTabChange={handleTabChange} />}
    </>
  );
};


export default PublishContent;