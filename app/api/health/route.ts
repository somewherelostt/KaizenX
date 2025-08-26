import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test connection to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kaizenx-production.up.railway.app";
    
    const backendResponse = await fetch(`${backendUrl}/api/health`, {
      method: "GET",
    });
    
    const backendData = await backendResponse.json();
    
    return NextResponse.json({
      frontend: "ok",
      backend: backendData,
      backendUrl: backendUrl,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { 
        frontend: "ok", 
        backend: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
