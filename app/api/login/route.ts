import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Get the backend API URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kaizenx-production.up.railway.app";
    
    console.log("Logging in user via backend:", backendUrl);
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Backend login error:", data);
      return NextResponse.json(
        { error: data.error || "Login failed" },
        { status: response.status }
      );
    }

    console.log("Login successful:", data);
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
