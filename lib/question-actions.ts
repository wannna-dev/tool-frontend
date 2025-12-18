"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ReactionType } from "@/types/reactions";

/*
  Get all questions with reactions
*/
export async function getQuestions() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: questions, error } = await supabase
    .from("questions")
    .select(`
      *,
      profiles (
        id,
        username,
        picture
      ),
      question_likes (
        user_id,
        reaction_type
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }

  const questionsWithReactions = questions.map((question) => {
    const reactions = question.question_likes || [];
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

    const { question_likes, ...questionData } = question;

    return {
      ...questionData,
      totalReactions,
      reactionCounts,
      userReactionType: userReaction?.reaction_type || null,
    };
  });

  return questionsWithReactions;
}

/*
  Create a new question
*/
export async function createQuestion(text: string, context: string, publishAsAnonymous: boolean, publishFor: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "No autenticado" };
  }

  if (!text || text.trim().length === 0) {
    return { error: "La pregunta no puede estar vacía" };
  }
  

  const { data, error } = await supabase
    .from("questions")
    .insert({ user_id: user.id, question: text.trim(), context: context.trim(), private: publishAsAnonymous, community_id: publishFor === "" ? null : publishFor})
    .select()
    .single();

  if (error) {
    console.error("Error creating question:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true, question: data };
}

/*
  Toggle reaction for a question
*/
export async function toggleQuestionReaction(questionId: string, reactionType: ReactionType) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "No autenticado" };
  }

  // Check if user already reacted to this question
  const { data: existingReaction, error: checkError } = await supabase
    .from("question_likes")
    .select("id, reaction_type")
    .eq("question_id", questionId)
    .eq("user_id", user.id)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    return { error: checkError.message };
  }

  if (existingReaction) {
    // If same reaction, remove it (unlike)
    if (existingReaction.reaction_type === reactionType) {
      const { error: deleteError } = await supabase
        .from("question_likes")
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
        .from("question_likes")
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
      .from("question_likes")
      .insert({ question_id: questionId, user_id: user.id, reaction_type: reactionType });

    if (insertError) {
      return { error: insertError.message };
    }

    revalidatePath("/");
    return { success: true, reacted: true, reactionType };
  }
}

/*
  Delete a question
*/
export async function deleteQuestion(questionId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "No autenticado" };
  }

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting question:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}