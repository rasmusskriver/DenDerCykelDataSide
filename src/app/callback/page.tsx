"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackPageContent() {
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
            // Store tokens securely (this should be handled differently in production)
            localStorage.setItem("stravaAccessToken", data.access_token);
            router.push("/"); // Redirect to home page after success
          }
        })
        .catch((error) => {
          console.error("Error during token exchange:", error);
        });
    }
  }, [searchParams, router]);

  return <div>Processing Strava authorization...</div>;
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading authorization...</div>}>
      <CallbackPageContent />
    </Suspense>
  );
}
