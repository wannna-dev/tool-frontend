"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ReactionType } from "@/types/reactions";

export async function toggleReaction(postId: string, postType: "post" | "note", reactionType: ReactionType) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "No autenticado" };
  }

  // Check if user already reacted to this post/note
  const { data: existingReaction, error: checkError } = await supabase
    .from(`${postType}_likes`)
    .select("id, reaction_type")
    .eq(`${postType}_id`, postId)
    .eq("user_id", user.id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    return { error: checkError.message };
  }

  if (existingReaction) {
    // If same reaction, remove it (unlike)
    if (existingReaction.reaction_type === reactionType) {
      const { error: deleteError } = await supabase
        .from(`${postType}_likes`)
        .delete()
        .eq("id", existingReaction.id);

      if (deleteError) {
        return { error: deleteError.message };
      }

      // Revalidate paths
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      
      return { success: true, reacted: false, reactionType: null };
    } else {
      // Update to new reaction type
      const { error: updateError } = await supabase
        .from(`${postType}_likes`)
        .update({ reaction_type: reactionType })
        .eq("id", existingReaction.id);

      if (updateError) {
        return { error: updateError.message };
      }

      // Revalidate paths
      revalidatePath("/", "layout");
      revalidatePath("/", "page");
      
      return { success: true, reacted: true, reactionType };
    }
  } else {
    // Add new reaction
    const { error: insertError } = await supabase
      .from(`${postType}_likes`)
      .insert({ [`${postType}_id`]: postId, user_id: user.id, reaction_type: reactionType });

    if (insertError) {
      return { error: insertError.message };
    }

    // Revalidate paths
    revalidatePath("/", "layout");
    revalidatePath("/", "page");
    
    return { success: true, reacted: true, reactionType };
  }
}