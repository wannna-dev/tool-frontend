// app/verify/page.tsx
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
    const { token } = await searchParams;
    console.log(token);

    if (!token) {
        return <div>No token provided</div>;
    }
    const res = await apiFetch(`/auth/magic-link/verify`, {
        method: "POST",
        body: JSON.stringify({ token }),
    });
    console.log(res);

    // Guardar token (localStorage)
    if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
    }

    // Redirigir a donde quieras (home, dashboard…)
    // redirect("/");

    return null;
}
