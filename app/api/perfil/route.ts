import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_ENV = "https://unforgeable-unforcibly-roxane.ngrok-free.dev";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");
        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }
        const token = (await cookies()).get("token")?.value;
        const res = await fetch(`${BACKEND_ENV}/users/${username}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}