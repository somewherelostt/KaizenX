import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authorization = request.headers.get("authorization");
    
    if (!authorization) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    // Get the backend API URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kaizenx-production.up.railway.app";
    
    console.log("Getting user data via backend:", backendUrl);
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/api/users/me`, {
      method: "GET",
      headers: {
        "Authorization": authorization,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Backend user fetch error:", data);
      return NextResponse.json(
        { error: data.error || "Failed to fetch user" },
        { status: response.status }
      );
    }

    console.log("User data fetched successfully");
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
