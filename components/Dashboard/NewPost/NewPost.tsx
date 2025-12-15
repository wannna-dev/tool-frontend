"use client";
import styles from "./NewPost.module.scss";
import { useState } from "react";
import { createPost } from "@/lib/post-actions";
import { useAppContext } from "@/context/AppContext";


const NewPost = () => {

  const { setToast } = useAppContext();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(title, content);
    if (title.trim() && content.trim()) {
      console.log("Post creado correctamente");

      const data = await createPost(title, content);
      if (data.success) {
        console.log("Post creado correctamente");
        setToast({
          show: true,
          message: "Post creado correctamente",
          type: "success",
        });
      } else {
        console.log("Error al crear el post");
        setToast({
          show: true,
          message: data.error || "Error al crear el post",
          type: "error",
        });
      }
    } else {
      console.log("Error al crear el post");
      setToast({
        show: true,
        message: "Error al crear el post",
        type: "error",
      });
    }

    setTitle("");
    setContent("");
  };

  return (
    <div className={styles.newpost}>
      <div className={styles.newpost__container}>
        <div className={styles.newpost__container__header}>
          <h1>Nuevo post</h1>
        </div>
        <div className={styles.newpost__container__content}>
          <div className={styles.newpost__container__content__form}>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />

              <textarea placeholder="Contenido" value={content} onChange={(e) => setContent(e.target.value)} />

              <button type="submit">Publicar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;