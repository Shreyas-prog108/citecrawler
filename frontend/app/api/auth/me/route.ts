import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      githubId: string;
      username: string;
      avatarUrl: string;
    };

    return NextResponse.json(decoded);
  } catch {
    return NextResponse.json(null, { status: 401 });
  }
}

