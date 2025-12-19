"use server";

import { createClient } from "@/utils/supabase/server";


export async function getCommunity(communityId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community")
    .select(`
      *,
      profiles (
        id,
        username,
        picture
      ),
      notes (
        id,
        content,
        created_at,
        profiles (
          id,
          username,
          picture
        ),
        note_likes (
          user_id,
          reaction_type
        )
      ),
      questions (
        id,
        question,
        created_at
      )
    `)
    .eq("id", communityId)
    .single();

  if (error) {
    console.error("Error fetching community:", error);
    return null;
  }
  return data;
}

/*
  Get all communities where user is a member
  @param userId - The user ID
  @returns {Promise<any[]>} - The communities the user belongs to
*/
export async function getCommunitiesOfUser(userId: string) {
  const supabase = await createClient();
  
  const { data: community, error } = await supabase
    .from("community_members")
    .select(`
      *,
      community (
        id,
        name,
        description,
        image,
        created_by,
        created_at
      )
    `)
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user communities:", error);
    return [];
  }

  // Retornar solo los datos de las comunidades
  return community?.map(item => item.community) || [];
}