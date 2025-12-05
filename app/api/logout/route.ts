import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  
  // Delete cookie by setting it with maxAge: 0
  response.cookies.set("token", "", { path: "/", maxAge: 0, httpOnly: true });
  response.cookies.set("username", "", { path: "/", maxAge: 0, httpOnly: true });
  
  return response;
}