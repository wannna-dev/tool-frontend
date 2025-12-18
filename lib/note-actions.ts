"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ReactionType } from "@/types/reactions";

/*
  Get all notes with reactions
*/
export async function getNotes() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notes, error } = await supabase
    .from("notes")
    .select(`
      *,
      profiles (
        id,
        username,
        picture
      ),
      note_likes (
        user_id,
        reaction_type
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  const notesWithReactions = notes.map((note) => {
    const reactions = note.note_likes || [];
    const totalReactions = reactions.length;
    
    // Count reactions by type
    const reactionCounts = {
      me_identifico: reactions.filter((r: { reaction_type: ReactionType }) => r.reaction_type === 'me_identifico').length,
      me_emociona: reactions.filter((r: { reaction_type: ReactionType }) => r.reaction_type === 'me_emociona').length,
      me_enseno: reactions.filter((r: { reaction_type: ReactionType }) => r.reaction_type === 'me_enseno').length,
      me_alegra: reactions.filter((r: { reaction_type: ReactionType }) => r.reaction_type === 'me_alegra').length,
    };

    // Check if current user reacted and with what type
    const userReaction = user
      ? reactions.find((r: { user_id: string }) => r.user_id === user.id)
      : null;

    const { note_likes, ...noteData } = note;

    return {
      ...noteData,
      totalReactions,
      reactionCounts,
      userReactionType: userReaction?.reaction_type || null,
    };
  });

  return notesWithReactions;
}

/*
  Create a new note
*/
export async function createNote(text: string, publishFor: string, publishAsAnonymous: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "No autenticado" };
  }

  if (!text || text.trim().length === 0) {
    return { error: "La nota no puede estar vacía" };
  }

  if (text.trim().length > 150) {
    return { error: "La nota no puede exceder 150 caracteres" };
  }


  const { data, error } = await supabase
    .from("notes")
    .insert({ user_id: user.id, content: text, community_id: publishFor === "" ? null : publishFor, private: publishAsAnonymous })
    .select()
    .single();

  if (error) {
    console.error("Error creating note:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true, note: data };
}

/*
  Toggle reaction for a note
*/
export async function toggleNoteReaction(noteId: string, reactionType: ReactionType) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "No autenticado" };
  }

  // Check if user already reacted to this note
  const { data: existingReaction, error: checkError } = await supabase
    .from("note_likes")
    .select("id, reaction_type")
    .eq("note_id", noteId)
    .eq("user_id", user.id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    return { error: checkError.message };
  }

  if (existingReaction) {
    // If same reaction, remove it (unlike)
    if (existingReaction.reaction_type === reactionType) {
      const { error: deleteError } = await supabase
        .from("note_likes")
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
        .from("note_likes")
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
      .from("note_likes")
      .insert({ note_id: noteId, user_id: user.id, reaction_type: reactionType });

    if (insertError) {
      return { error: insertError.message };
    }

    revalidatePath("/");
    return { success: true, reacted: true, reactionType };
  }
}

/*
  Delete a note
*/
export async function deleteNote(noteId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "No autenticado" };
  }

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting note:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}