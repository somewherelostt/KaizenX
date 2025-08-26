import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Get the backend API URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kaizenx-production.up.railway.app";
    
    console.log("Registering user via backend:", backendUrl);
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Backend registration error:", data);
      return NextResponse.json(
        { error: data.error || "Registration failed" },
        { status: response.status }
      );
    }

    console.log("Registration successful:", data);
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
