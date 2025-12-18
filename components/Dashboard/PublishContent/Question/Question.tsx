"use client";
import styles from "./Question.module.scss";
import Image from "next/image";
import { useState } from "react";
import { createQuestion } from "@/lib/question-actions";
import { useAppContext } from "@/context/AppContext";
import PublishFor from "@/components/PublishFor/PublishFor";
import PublishAs from "@/components/PublishAs/PublishAs";

type TabType = "" | "note" | "post" | "question";

const Question = ({ handleTabChange }: { handleTabChange: (tab: TabType) => void }) => {

  const { setToast } = useAppContext();
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [publishFor, setPublishFor] = useState<string>("");
  const [publishAsAnonymous, setPublishAsAnonymous] = useState<boolean>(false);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    // Remove ALL ¿ and ? characters to get the core content
    const content = value.replace(/[¿?]/g, "");
    
    // If there's content, add the symbols
    if (content.length > 0) {
      value = "¿" + content + "?";
    } else {
      value = "";
    }
    
    setQuestion(value);
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContext(e.target.value);
  };

  const handlePublishFor = (communityId: string) => {
    console.log("Community ID:", communityId);
    setPublishFor(communityId);
  };

  const handlePublishAs = (isAnonymous: boolean) => {
    setPublishAsAnonymous(isAnonymous);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (question.trim()) {
      console.log("Question submitted:", question, context, publishAsAnonymous, publishFor);
      const data = await createQuestion(question, context, publishAsAnonymous, publishFor);
      if (data.success) {
        setToast({
          show: true,
          message: "Pregunta publicada correctamente",
          type: "success",
        });
      } else {
        setToast({
          show: true,
          message: data.error || "Error al publicar la pregunta",
          type: "error",
        });
      }
      // Reset and close
      setQuestion("");
      handleTabChange("");
    }
  };


    return (
        <div className={styles.question}>
          
          <div className={styles.question__bg} onClick={() => handleTabChange("")} />
          
          <div className={styles.question__modal}>

            <div className={styles.question__modal__header}>
              <p className={styles.question__modal__header__title}>Pregunta</p>
              <button
                data-variant="icon"
                type="button"
                onClick={() => handleTabChange("")}
              >
                <Image src="/svg/close.svg" alt="close" width={16} height={16} />
              </button>
            </div>

            <div className={styles.question__modal__settings}>
              <PublishFor handlePublishFor={handlePublishFor} />
              <PublishAs handlePublishAs={handlePublishAs} />
            </div>

            <form className={styles.question__modal__form} onSubmit={handleSubmit}>
              <div className={styles.question__modal__form__content}>
                <textarea
                  className={styles.question__modal__form__content__question}
                  id="question"
                  placeholder="Empieza la pregunta con 'Qué', 'Cómo', 'Por qué', etc..."
                  rows={2}
                  value={question}
                  onChange={handleQuestionChange}
                />
                
                <textarea
                  className={styles.question__modal__form__content__context}
                  id="context"
                  placeholder="Contexto de la pregunta"
                  rows={5}
                  value={context}
                  onChange={handleContextChange}
                />
              </div>

              <button 
                  type="submit"
                  className={styles.note__modal__form__submit}
                  disabled={!question.trim()}
                >
                  Publicar
                </button>
            </form>

          </div>  
        </div>
    );
};

export default Question;