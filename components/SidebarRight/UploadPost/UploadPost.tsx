import styles from "./UploadPost.module.scss";
import { useState, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

const UploadPost = () => {
    const router = useRouter();
    const { setIsSidebarRightOpen } = useAppContext();
    // States
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Refs
    const imageInputRef = useRef<HTMLInputElement>(null);
    const titleInputRef = useRef<HTMLTextAreaElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

    // Functions
    /**
     * Handle image change
     * @param e - React.ChangeEvent<HTMLInputElement>
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFile(file);
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

    const handleUploadPost = async () => {
        const res = await fetch("/api/upload-post", {
            method: "POST",
            body: JSON.stringify({ content }),
        });
        const data = await res.json();
        if (data) {
            setContent("");
            setIsSidebarRightOpen(false);
            router.push("/");
        } else {
            console.error(data.error);
        }
    }

    return (
        <div className={styles.uploadPost}>

            <form className={styles.uploadPost__form} onSubmit={handleUploadPost}>
                {/* Image */}
                <div
                    className={`${styles.uploadPost__form__image} ${file ? styles.uploadPost__imageSelected : ""}`}
                    style={{ backgroundImage: file ? `url(${URL.createObjectURL(file)})` : "none" }}
                    onClick={() => imageInputRef.current?.click()}
                >
                    {!file && (
                        <div className={styles.uploadPost__form__image__placeholder}>
                            <Image src="/svg/cloud.svg" alt="subir imagen" width={24} height={24} />
                            <p className={styles.uploadPost__form__image__placeholder__text}>Click para seleccionar una imagen</p>
                        </div>
                    )}
                    {file && (
                        <div className={styles.uploadPost__form__image__trash} onClick={(e) => handleImageTrash(e)}>
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
                <div className={styles.uploadPost__form__item}>
                    <p className={styles.uploadPost__form__item__title}>Título*</p>
                    <textarea
                        className={styles.uploadPost__form__item__textarea}
                        ref={titleInputRef}
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        rows={2}
                    />
                </div>

                {/* Description */}
                <div className={styles.uploadPost__form__item}>
                    <p className={styles.uploadPost__form__item__title}>Descripción*</p>
                    <textarea
                        className={`${styles.uploadPost__form__item__textarea} ${styles.uploadPost__form__item__textarea__description}`}
                        ref={descriptionInputRef}
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={10}
                    />
                </div>

                {/* Button */}
                <button className={styles.uploadPost__form__button} type="submit" data-variant="primary" onClick={handleUploadPost}>Publicar</button>
            </form>

        </div>
    );
};

export default UploadPost;