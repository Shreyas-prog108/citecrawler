import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// For App Router server components
export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) return null;
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      githubId: string;
      username: string;
      avatarUrl: string;
    };
  } catch {
    return null;
  }
}

// For client-side (decode without verification - less secure but works on client)
export function decodeToken(token: string) {
  try {
    return jwt.decode(token) as {
      userId: string;
      githubId: string;
      username: string;
      avatarUrl: string;
    } | null;
  } catch {
    return null;
  }
}
