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
  Create a new post
  @param title - The title of the post
  @param content - The content of the post
  @returns {Promise<{error: string, success: boolean, post: PostType}>} - The result of the create post
*/
export async function createPost(title: string, content: string, image: string) {
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
    .insert({ title, description: content, user_id: user.id, image: image })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true, post: data };
}

/*
  Toggle like for a post
  @param postId - The ID of the post to toggle like
  @returns {Promise<{error: string, success: boolean, liked: boolean}>} - The result of the toggle like
*/
export async function toggleReaction(postId: string, reactionType: ReactionType) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "No autenticado" };
  }

  // Check if user already reacted to this post
  const { data: existingReaction, error: checkError } = await supabase
    .from("post_likes")
    .select("id, reaction_type")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    return { error: checkError.message };
  }

  if (existingReaction) {
    // If same reaction, remove it (unlike)
    if (existingReaction.reaction_type === reactionType) {
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("id", existingReaction.id);

      if (deleteError) {
        return { error: deleteError.message };
      }

      revalidatePath("/");
      return { success: true, reacted: false, reactionType: null };
    } else {
      // Update to new reaction type
      const { error: updateError } = await supabase
        .from("post_likes")
        .update({ reaction_type: reactionType })
        .eq("id", existingReaction.id);

      if (updateError) {
        return { error: updateError.message };
      }

      revalidatePath("/");
      return { success: true, reacted: true, reactionType };
    }
  } else {
    // Add new reaction
    const { error: insertError } = await supabase
      .from("post_likes")
      .insert({ post_id: postId, user_id: user.id, reaction_type: reactionType });

    if (insertError) {
      return { error: insertError.message };
    }

    revalidatePath("/");
    return { success: true, reacted: true, reactionType };
  }
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