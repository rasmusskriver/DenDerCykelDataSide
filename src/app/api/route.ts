import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID!,
        client_secret: process.env.STRAVA_CLIENT_SECRET!,
        code: code,
        grant_type: "authorization_code",
      }).toString(),
    });

    const data = await response.json();

    console.log("Strava API response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Strava API error:", data);
      return NextResponse.json(
        { error: data.message || "Token exchange failed" },
        { status: response.status },
      );
    }

    // I production bør du gemme refresh_token sikkert i en database
    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
  } catch (error) {
    console.error("Error in token route:", error);
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 500 },
    );
  }
}
