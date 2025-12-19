"use client";
import styles from "./NewPost.module.scss";
import { useState, useRef } from "react";
import { createPost } from "@/lib/post-actions";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Tiptap from "@/components/Tiptap/Tiptap";

const NewPost = () => {

  const { setToast } = useAppContext();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Refs
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(title, content);
    if (title.trim() && content.trim()) {
      console.log("Post creado correctamente");

      let uploadedImageUrl = "";
      if (file) {
        const formData = new FormData();
        formData.append("file", file as File);
        formData.append("folder", "posts");
        const res = await fetch("/api/s3-upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          uploadedImageUrl = data.url;
        } else {
          console.error(data.error);
          return;
        }
      }

      const data = await createPost(title, content, uploadedImageUrl);
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

  /**
     * Handle image trash
     * @param e - React.ChangeEvent<HTMLInputElement>
     */
  const handleImageTrash = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (imageInputRef.current) {
        imageInputRef.current.value = "";
        setFile(null);
    }
  };

  /**
     * Handle image change
     * @param e - React.ChangeEvent<HTMLInputElement>
     */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
  };

  return (
    <div className={styles.newpost}>
      <div className={styles.newpost__container}>
        <div className={styles.newpost__container__header}>
          <h1 className={styles.newpost__container__header__title}>Nuevo post</h1>
        </div>
        <div className={styles.newpost__container__content}>
          <div className={styles.newpost__container__content__form}>
            <form className={styles.newpost__container__content__form__form} onSubmit={handleSubmit}>
              <div className={styles.newpost__container__content__form__form__content}>
                {/* Image */}
                <div
                    className={`${styles.newpost__container__content__form__form__content__image} ${file ? styles.newpost__container__content__form__form__content__imageSelected : ""}`}
                    style={{ backgroundImage: file ? `url(${URL.createObjectURL(file)})` : "none" }}
                    onClick={() => imageInputRef.current?.click()}
                >
                    {!file && (
                        <div className={styles.newpost__container__content__form__form__content__image__placeholder}>
                            <Image src="/svg/cloud.svg" alt="subir imagen" width={24} height={24} />
                            <p className={styles.newpost__container__content__form__form__content__image__placeholder__text}>Click para seleccionar una imagen</p>
                        </div>
                    )}
                    {file && (
                        <div className={styles.newpost__container__content__form__form__content__image__trash} onClick={(e) => handleImageTrash(e)}>
                            <Image src="/svg/trash.svg" alt="borrar imagen" width={18} height={18} />
                        </div>
                    )}
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                    />
                </div>
                
                {/* Title */}
                <input
                  className={styles.newpost__container__content__form__form__content__input}
                  type="text"
                  placeholder="Escribe el título de tu post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                
                {/* Content */}
                {/* <textarea
                  className={styles.newpost__container__content__form__form__content__textarea}
                  placeholder="Empieza a escribir tu post..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                /> */}

                <Tiptap setContent={setContent} />
              </div>


              <button className={styles.newpost__container__content__form__form__button} type="submit">Publicar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;