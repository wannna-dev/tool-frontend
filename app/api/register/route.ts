import { NextResponse } from "next/server";

const BACKEND_ENV = "https://unforgeable-unforcibly-roxane.ngrok-free.dev";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const res = await fetch(`${BACKEND_ENV}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // Leemos el body como texto
    const text = await res.text();

    // Intentamos parsearlo como JSON
    let data: any;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || "No content" };
    }

    // Devuelve exactamente el status del backend
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || data.message || "Login failed" },
        { status: res.status }
      );
    }

    const token = data.token;

    const response = NextResponse.json({ success: true, ...data });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    response.cookies.set("username", username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
