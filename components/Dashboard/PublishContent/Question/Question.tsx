"use client";
import styles from "./Question.module.scss";
import Image from "next/image";
import { useState } from "react";
import { createQuestion } from "@/lib/question-actions";
import { useAppContext } from "@/context/AppContext";

type TabType = "" | "note" | "post" | "question";

const Question = ({ handleTabChange }: { handleTabChange: (tab: TabType) => void }) => {

  const { setToast } = useAppContext();
  const [question, setQuestion] = useState("");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (question.trim()) {
      console.log("Question submitted:", question);
      const data = await createQuestion(question, "public");
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
              <p className={styles.question__modal__header__title}>Crear pregunta</p>
              <button
                data-variant="icon"
                type="button"
                onClick={() => handleTabChange("")}
              >
                <Image src="/svg/close.svg" alt="close" width={16} height={16} />
              </button>
            </div>

            <form className={styles.question__modal__form} onSubmit={handleSubmit}>
              <div className={styles.question__modal__form__content}>
                <textarea
                  id="question"
                  placeholder="Empieza la pregunta con 'Qué', 'Cómo', 'Por qué', etc..."
                  rows={5}
                  value={question}
                  onChange={handleQuestionChange}
                />

                <h1>CONTEXT</h1>
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