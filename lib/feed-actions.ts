"use server";

import { createClient } from "@/utils/supabase/server";

/*
  Get the feed
  @returns {Promise<{error: string, feed: FeedType[]}>} - The result of the get feed
*/
export async function getFeed() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch posts
  const { data: posts, error: postsError } = await supabase
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

  // Fetch notes
  const { data: notes, error: notesError } = await supabase
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

  if (postsError || notesError) {
    console.error("Error fetching feed:", { postsError, notesError});
    return [];
  }

  // Process posts with reactions
  const processedPosts = (posts || []).map((post) => {
    const reactions = post.post_likes || [];
    const totalReactions = reactions.length;
    
    const reactionCounts = {
      me_identifico: reactions.filter((r: { reaction_type: string }) => r.reaction_type === 'me_identifico').length,
      me_emociona: reactions.filter((r: { reaction_type: string }) => r.reaction_type === 'me_emociona').length,
      me_enseno: reactions.filter((r: { reaction_type: string }) => r.reaction_type === 'me_enseno').length,
      me_alegra: reactions.filter((r: { reaction_type: string }) => r.reaction_type === 'me_alegra').length,
    };

    const userReaction = user
      ? reactions.find((r: { user_id: string }) => r.user_id === user.id)
      : null;

    const { post_likes, ...postData } = post;

    return {
      ...postData,
      type: 'post' as const,
      totalReactions,
      reactionCounts,
      userReactionType: userReaction?.reaction_type || null,
    };
  });

  // Process notes
  const processedNotes = (notes || []).map((note) => {
    const reactions = note.note_likes || [];
    const totalReactions = reactions.length;
    
    const reactionCounts = {
      me_identifico: reactions.filter((r: { reaction_type: string }) => r.reaction_type === 'me_identifico').length,
      me_emociona: reactions.filter((r: { reaction_type: string }) => r.reaction_type === 'me_emociona').length,
      me_enseno: reactions.filter((r: { reaction_type: string }) => r.reaction_type === 'me_enseno').length,
      me_alegra: reactions.filter((r: { reaction_type: string }) => r.reaction_type === 'me_alegra').length,
    };

    const userReaction = user
      ? reactions.find((r: { user_id: string }) => r.user_id === user.id)
      : null;

    const { note_likes, ...noteData } = note;

    return {
      ...noteData,
      type: 'note' as const,
      totalReactions,
      reactionCounts,
      userReactionType: userReaction?.reaction_type || null,
    };
  });


  // Combine all items
  const feedItems = [
    ...processedPosts,
    ...processedNotes,
  ];

  // Sort by created_at descending
  feedItems.sort(() => Math.random() - 0.5);
  return feedItems;
}