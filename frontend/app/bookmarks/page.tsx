"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink, FileText, Calendar, User, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface Paper {
  id: string;
  title: string;
  link: string;
  source: string;
  keyword: string;
  abstract?: string;
  authors?: string[];
  publishedDate?: string;
  isBookmarked?: boolean;
}

export default function BookmarksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Fetch bookmarks
  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bookmarks");
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPDF = (paper: Paper) => {
    // Convert arXiv link to PDF link
    let pdfUrl = paper.link;
    if (paper.link.includes('arxiv.org/abs/')) {
      pdfUrl = paper.link.replace('/abs/', '/pdf/') + '.pdf';
    } else if (paper.link.includes('arxiv.org/pdf/')) {
      // Already a PDF link
      pdfUrl = paper.link;
    }
    
    // Open PDF in new tab
    window.open(pdfUrl, '_blank');
  };

  const handleRemoveBookmark = async (paper: Paper) => {
    try {
      const response = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: paper.id }),
      });
      
      if (response.ok) {
        setBookmarks(prev => prev.filter(b => b.id !== paper.id));
      }
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Header Section */}
        <section className="py-12 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                My Bookmarks 📚
              </h1>
              <p className="text-lg text-muted-foreground">
                Your saved research papers and articles
              </p>
            </div>
          </div>
        </section>

        {/* Bookmarks Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your bookmarks...</p>
              </div>
            ) : bookmarks.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Saved Papers ({bookmarks.length})</h2>
                  <p className="text-muted-foreground">Your collection of research papers</p>
                </div>

                <div className="grid gap-4">
                  {bookmarks.map((paper) => (
                    <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{paper.keyword}</Badge>
                              <Badge variant="secondary">{paper.source}</Badge>
                            </div>
                            
                            <h3 className="text-lg font-semibold mb-2">
                              {paper.title}
                            </h3>
                            
                            {paper.abstract && (
                              <p className="text-muted-foreground mb-3">
                                {paper.abstract}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {paper.authors && paper.authors.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  {paper.authors.slice(0, 2).join(", ")}
                                  {paper.authors.length > 2 && ` +${paper.authors.length - 2} more`}
                                </span>
                              )}
                              {paper.publishedDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(paper.publishedDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleViewPDF(paper)}
                              title="View PDF"
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(paper.link, "_blank")}
                              title="View Abstract"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveBookmark(paper)}
                              title="Remove Bookmark"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Bookmarks Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start bookmarking papers from your search results to see them here
                </p>
                <Button onClick={() => router.push("/home")}>
                  Start Searching
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
