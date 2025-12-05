import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_ENV = "https://unforgeable-unforcibly-roxane.ngrok-free.dev";

export async function POST(req: Request) {
    try {
        const { content } = await req.json();

        const token = (await cookies()).get("token")?.value;

        const res = await fetch(`${BACKEND_ENV}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ content }),
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}