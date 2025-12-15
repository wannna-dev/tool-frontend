'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface VerifyPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default function VerifyPage({ searchParams }: VerifyPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = (await searchParams).token;

      if (!token) {
        setError("No token provided.");
        return;
      }

      try {
        // Call your API to verify token and set HTTP-only cookies
        const res = await fetch("/api/auth/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          setError("Failed to verify token.");
          return;
        }

        // Redirect to dashboard or home page
        router.push("/");
      } catch (err) {
        console.error("Verification error:", err);
        setError("Failed to verify token. Please try again.");
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="verify-page">
      {error ? <p className="text-red-500">{error}</p> : <p>Verifying...</p>}
    </div>
  );
}
