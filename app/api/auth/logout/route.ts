import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Clear the auth token cookie
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return response;
}

export async function GET(req: NextRequest) {
  // Also support GET for simple logout links
  const response = NextResponse.redirect(new URL("/", req.url));
  
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}

