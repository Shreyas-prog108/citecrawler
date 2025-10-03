import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import User from "@/models/users";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("📚 GET /api/bookmarks called");
    const user = await getUser();
    console.log("📚 User from auth:", user);
    
    if (!user) {
      console.log("📚 No user found, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    let userDoc = await User.findOne({ githubId: user.githubId });
    console.log("📚 User doc from DB:", userDoc ? "Found" : "Not found");
    
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize bookmarks field if it doesn't exist
    if (!userDoc.bookmarks) {
      console.log("📚 Bookmarks field missing, initializing...");
      userDoc.bookmarks = [];
      await userDoc.save();
      console.log("📚 Bookmarks field initialized");
    }

    // Ensure bookmarks is an array
    const bookmarks = userDoc.bookmarks || [];
    console.log("📚 Bookmarks from DB:", bookmarks.length, "items");
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔖 POST /api/bookmarks called");
    const user = await getUser();
    console.log("🔖 User from auth:", user);
    
    if (!user) {
      console.log("🔖 No user found, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paper } = await request.json();
    console.log("🔖 Paper data:", paper);
    
    if (!paper) {
      return NextResponse.json({ error: "Paper data required" }, { status: 400 });
    }

    console.log("🔖 Connecting to database...");
    await dbConnect();
    console.log("🔖 Database connected");
    
    let userDoc = await User.findOne({ githubId: user.githubId });
    console.log("🔖 User doc found:", userDoc ? "Yes" : "No");
    
    if (!userDoc) {
      console.log("🔖 User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize bookmarks array if it doesn't exist
    if (!userDoc.bookmarks) {
      console.log("🔖 Bookmarks field missing, initializing...");
      userDoc.bookmarks = [];
      await userDoc.save();
      console.log("🔖 Bookmarks field initialized");
    }
    
    // Check if paper is already bookmarked
    const isBookmarked = userDoc.bookmarks.some((bookmark: any) => bookmark.id === paper.id);
    
    if (isBookmarked) {
      return NextResponse.json({ error: "Paper already bookmarked" }, { status: 400 });
    }

    // Add bookmark
    const bookmarkData = {
      id: paper.id,
      title: paper.title,
      link: paper.link,
      source: paper.source,
      keyword: paper.keyword,
      abstract: paper.abstract,
      authors: paper.authors || [],
      publishedDate: paper.publishedDate,
    };
    
    console.log("🔖 Adding bookmark:", bookmarkData);
    userDoc.bookmarks.push(bookmarkData);
    console.log("🔖 Bookmarks array length:", userDoc.bookmarks.length);

    console.log("🔖 Saving user document...");
    await userDoc.save();
    console.log("🔖 User document saved successfully");

    return NextResponse.json({ message: "Bookmark added successfully" });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return NextResponse.json({ error: "Failed to add bookmark" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paperId } = await request.json();
    if (!paperId) {
      return NextResponse.json({ error: "Paper ID required" }, { status: 400 });
    }

    await dbConnect();
    const userDoc = await User.findOne({ githubId: user.githubId });
    
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize bookmarks array if it doesn't exist
    if (!userDoc.bookmarks) {
      userDoc.bookmarks = [];
    }
    
    // Remove bookmark
    userDoc.bookmarks = userDoc.bookmarks.filter((bookmark: any) => bookmark.id !== paperId);
    await userDoc.save();

    return NextResponse.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json({ error: "Failed to remove bookmark" }, { status: 500 });
  }
}
