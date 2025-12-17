"use server";

import { createClient } from "@/utils/supabase/server";

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