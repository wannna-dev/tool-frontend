"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ReactionType } from "@/types/reactions";


/*
  Get all posts
  @returns {Promise<{error: string, posts: PostType[]}>} - The result of the get posts
*/
export async function getPosts() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        id,
        username,
        picture
      ),
      post_likes (
        user_id,
        reaction_type
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  const postsWithReactions = posts.map((post) => {
    const reactions = post.post_likes || [];
    const totalReactions = reactions.length;
    
    // Count reactions by type
    const reactionCounts = {
      me_identifico: reactions.filter((r: { reaction_type: string; }) => r.reaction_type === 'me_identifico').length,
      me_emociona: reactions.filter((r: { reaction_type: string; }) => r.reaction_type === 'me_emociona').length,
      me_enseno: reactions.filter((r: { reaction_type: string; }) => r.reaction_type === 'me_enseno').length,
      me_alegra: reactions.filter((r: { reaction_type: string; }) => r.reaction_type === 'me_alegra').length,
    };

    // Check if current user reacted and with what type
    const userReaction = user
      ? reactions.find((r: { user_id: string; }) => r.user_id === user.id)
      : null;

    const { post_likes, ...postData } = post;

    return {
      ...postData,
      totalReactions,
      reactionCounts,
      userReactionType: userReaction?.reaction_type || null,
    };
  });

  return postsWithReactions;
}


/*
  Get a post by id
  @param postId - The ID of the post to get
  @returns {Promise<{error: string, post: PostType}>} - The result of the get post
*/
export async function getPost(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        id,
        username,
        picture
      ),
      post_likes (
        user_id,
        reaction_type
      )
    `)
    .eq("id", postId)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  const reactions = post.post_likes || [];
  const totalReactions = reactions.length;
  
  // Count reactions by type
  const reactionCounts = {
    me_identifico: reactions.filter((r: { reaction_type: string; }) => r.reaction_type === 'me_identifico').length,
    me_emociona: reactions.filter((r: { reaction_type: string; }) => r.reaction_type === 'me_emociona').length,
    me_enseno: reactions.filter((r: { reaction_type: string; }) => r.reaction_type === 'me_enseno').length,
    me_alegra: reactions.filter((r: { reaction_type: string; }) => r.reaction_type === 'me_alegra').length,
  };

  // Check if current user reacted and with what type
  const userReaction = user
    ? reactions.find((r: { user_id: string; }) => r.user_id === user.id)
    : null;

  const { post_likes, ...postData } = post;

  return {
    ...postData,
    totalReactions,
    reactionCounts,
    userReactionType: userReaction?.reaction_type || null,
  };
}
/*
  Create a new post
  @param title - The title of the post
  @param content - The content of the post
  @returns {Promise<{error: string, success: boolean, post: PostType}>} - The result of the create post
*/
export async function createPost(title: string, content: string, image: string, publishAsAnonymous: boolean, publishFor: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "No autenticado" };
  }

  if (!title || !content) {
    return { error: "El título y el contenido son requeridos" };
  }
  
  if (title.trim().length > 100) {
    return { error: "El título no puede exceder 100 caracteres" };
  }

  if (content.trim().length > 1000) {
    return { error: "El contenido no puede exceder 1000 caracteres" };
  }
  
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, description: content, user_id: user.id, image: image, private: publishAsAnonymous, community_id: publishFor === "" ? null : publishFor })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true, post: data };
}


/*
  Get the likes count for a post
  @param postId - The ID of the post to get the likes count
  @returns {Promise<{error: string, likesCount: number, isLikedByUser: boolean}>} - The result of the get post likes
*/
export async function getPostLikes(postId: string) {
  const supabase = await createClient();

  // Get current user (might be null if not logged in)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get total likes count
  const { count, error: countError } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (countError) {
    return { error: countError.message };
  }

  // Check if current user liked this post
  let isLikedByUser = false;
  if (user) {
    const { data: userLike } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single();

    isLikedByUser = !!userLike;
  }

  return {
    likesCount: count || 0,
    isLikedByUser,
  };
}