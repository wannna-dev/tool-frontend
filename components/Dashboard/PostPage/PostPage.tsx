import styles from "./PostPage.module.scss";
import { getPost } from "@/lib/post-actions";
import { useEffect, useState } from "react";
import { PostType } from "@/types/post";
import PostCard from "../Muro/PostCard/PostCard";

const PostPage = ({ postId }: { postId: string }) => {

  const [post, setPost] = useState<PostType | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const post = await getPost(postId);
      setPost(post);
    }
    fetchPost();
  }, [postId]);
    return (
        <div className={styles.page}>
            {post && (
                <PostCard post={post as PostType} longText={true} />
            )}
        </div>
    );
};

export default PostPage;