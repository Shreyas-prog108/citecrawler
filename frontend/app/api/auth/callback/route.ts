import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/users";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI,
        state,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: "Failed to fetch GitHub token" }, { status: 401 });
    }

    // 2. Fetch user info from GitHub
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const ghUser = await userRes.json();

    // 3. Fetch user emails
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const emails = await emailRes.json();
    const primaryEmail = emails.find((e: any) => e.primary)?.email || ghUser.email;

    // 4. Save or update user in MongoDB
    await dbConnect();
    let user = await User.findOne({ githubId: ghUser.id });
    if (!user) {
      user = await User.create({
        githubId: ghUser.id,
        username: ghUser.login,
        email: primaryEmail,
        avatarUrl: ghUser.avatar_url,
      });
    }

    // 5. Create JWT token
    const token = jwt.sign(
      { userId: user._id, githubId: user.githubId, username: user.username, avatarUrl: user.avatarUrl },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 6. Set cookie and redirect to dashboard/home
    const response = NextResponse.redirect(new URL("/home", req.url));
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from "strict" to "lax"
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    console.log("🍪 Cookie set for user:", user.username);

    return response;

  } catch (err: any) {
    console.error("OAuth error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}

