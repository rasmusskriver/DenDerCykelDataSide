"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const authCode = searchParams.get("code");

    if (authCode) {
      // Exchange auth code for tokens
      fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: authCode }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error("Auth error:", data.error);
          } else {
            // Gem tokens sikkert (i production bør dette håndteres anderledes)
            localStorage.setItem("stravaAccessToken", data.access_token);
            router.push("/");
          }
        })
        .catch((error) => {
          console.error("Error during token exchange:", error);
        });
    }
  }, [searchParams, router]);

  return <div>Behandler Strava authorization...</div>;
}
