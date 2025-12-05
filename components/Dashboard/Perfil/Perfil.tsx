import styles from "./Perfil.module.scss";
import { useEffect, useState } from "react";

const Perfil = ({username}: {username?: string}) => {

    const [perfil, setPerfil] = useState<any>(null);

    useEffect(() => {
        const fetchPerfil = async () => {
            const res = await fetch(`/api/perfil?username=${username}`);
            const data = await res.json();
            setPerfil(data);
        }
        if (username) {
            fetchPerfil();
        }
    }, [username]);
    return (
        <div className={styles.perfil}>
            {perfil && (
                <div className={styles.perfil__container}>
                    <div className={styles.perfil__avatar} />
                    <h2>{perfil.username}</h2>
                    <p>{perfil.description}</p>
                    <div className={styles.perfil__posts}>
                        { perfil && perfil.posts && perfil.posts.map((post: any) => (
                            <div key={post.id} className={styles.perfil__post}>
                                <p>{post.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Perfil;