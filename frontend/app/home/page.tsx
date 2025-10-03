"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Bookmark, ExternalLink, Calendar, User, FileText, ChevronLeft, ChevronRight } from "lucide-react";
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

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [allPapers, setAllPapers] = useState<Paper[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarks, setBookmarks] = useState<Paper[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'bookmarks'>('search');

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Fetch bookmarks when user is loaded
  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

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

  const handleLoadMore = async () => {
    if (!searchQuery.trim() || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const nextPage = currentPage + 1;
      const searchUrl = `${backendUrl}/search?q=${encodeURIComponent(searchQuery)}&top_k=10&page=${nextPage}`;
      
      console.log("🔄 Loading more papers:", searchUrl);
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Load more error:", response.status, errorText);
        return;
      }

      const data = await response.json();
      console.log("✅ Load more response:", data);
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        setHasMoreResults(false);
        return;
      }
      
      // Transform the data
      const newPapers = data.map((paper: any, index: number) => ({
        id: paper.id || `paper-${papers.length + index}`,
        title: paper.title || "Untitled",
        link: paper.link || "",
        source: paper.source || "Papers",
        keyword: searchQuery,
        abstract: paper.abstract || "",
        authors: [],
        publishedDate: new Date().toISOString(),
        score: paper.score || 0,
        isBookmarked: false,
      }));
      
      // Append new papers to existing ones
      setAllPapers(prev => [...prev, ...newPapers]);
      setCurrentPage(nextPage);
      setTotalPages(Math.ceil((allPapers.length + newPapers.length) / 10));
      
      // If we got less than 10 results, no more pages
      if (data.length < 10) {
        setHasMoreResults(false);
      }
      
    } catch (error) {
      console.error("❌ Load more failed:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCurrentPagePapers = () => {
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return allPapers.slice(startIndex, endIndex);
  };

  const handleBookmark = async (paper: Paper) => {
    try {
      console.log("🔖 Bookmarking paper:", paper);
      
      // Check if user is authenticated
      if (!user) {
        console.error("❌ User not authenticated");
        alert("Please log in to bookmark papers.");
        return;
      }
      
      // Validate paper object
      if (!paper || !paper.id || !paper.title) {
        console.error("❌ Invalid paper object:", paper);
        alert("Invalid paper data. Please try a different paper.");
        return;
      }
      
      const isBookmarked = bookmarks.some(b => b.id === paper.id);
      console.log("🔖 Is already bookmarked:", isBookmarked);
      
      if (isBookmarked) {
        // Remove bookmark
        console.log("🔖 Removing bookmark...");
        const response = await fetch("/api/bookmarks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paperId: paper.id }),
        });
        
        console.log("🔖 Remove response:", response.status);
        if (response.ok) {
          setBookmarks(prev => prev.filter(b => b.id !== paper.id));
          setAllPapers(prev => prev.map(p => 
            p.id === paper.id ? { ...p, isBookmarked: false } : p
          ));
          console.log("✅ Bookmark removed");
        } else {
          const errorText = await response.text();
          console.error("❌ Remove bookmark failed:", errorText);
        }
      } else {
        // Add bookmark
        console.log("🔖 Adding bookmark...");
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paper }),
        });
        
        console.log("🔖 Add response:", response.status);
        if (response.ok) {
          const newBookmark = { ...paper, isBookmarked: true };
          setBookmarks(prev => [...prev, newBookmark]);
          setAllPapers(prev => prev.map(p => 
            p.id === paper.id ? { ...p, isBookmarked: true } : p
          ));
          console.log("✅ Bookmark added");
        } else {
          const errorText = await response.text();
          console.error("❌ Add bookmark failed:", errorText);
          alert("Failed to add bookmark. Please try again.");
        }
      }
    } catch (error) {
      console.error("❌ Bookmark failed:", error);
      alert("An error occurred while bookmarking. Please try again.");
    }
  };

  const fetchBookmarks = async () => {
    try {
      console.log("📚 Fetching bookmarks...");
      const response = await fetch("/api/bookmarks");
      console.log("📚 Bookmarks response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("📚 Bookmarks data:", data);
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setBookmarks(data);
        } else {
          console.warn("📚 Bookmarks data is not an array:", data);
          setBookmarks([]);
        }
      } else {
        const errorText = await response.text();
        console.error("❌ Failed to fetch bookmarks:", errorText);
        setBookmarks([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch bookmarks:", error);
      setBookmarks([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    console.log("🔍 Starting search for:", searchQuery);
    setIsSearching(true);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const searchUrl = `${backendUrl}/search?q=${encodeURIComponent(searchQuery)}&top_k=10`;
      
      console.log("🔍 Search URL:", searchUrl);
      
      const response = await fetch(searchUrl);
      console.log("🔍 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Backend error:", response.status, errorText);
        alert(`Backend error: ${response.status}`);
        return;
      }

      const data = await response.json();
      console.log("✅ Backend response:", data);
      console.log("✅ Data type:", typeof data);
      console.log("✅ Is array:", Array.isArray(data));
      console.log("✅ Data length:", data?.length);
      
      if (!data || !Array.isArray(data)) {
        console.log("⚠️ Invalid data format");
        setPapers([]);
        return;
      }
      
      if (data.length === 0) {
        console.log("⚠️ No results from backend");
        setPapers([]);
        return;
      }
      
      // Transform the data
      const transformedPapers = data.map((paper: any, index: number) => ({
        id: paper.id || `paper-${index}`,
        title: paper.title || "Untitled",
        link: paper.link || "",
        source: paper.source || "Papers",
        keyword: searchQuery,
        abstract: paper.abstract || "",
        authors: [],
        publishedDate: new Date().toISOString(),
        score: paper.score || 0,
        isBookmarked: false,
      }));
      
      console.log("✅ Transformed papers:", transformedPapers);
      setAllPapers(transformedPapers);
      setCurrentPage(1);
      setTotalPages(Math.ceil(transformedPapers.length / 10));
      setHasMoreResults(transformedPapers.length >= 10);
      
    } catch (error) {
      console.error("❌ Search failed:", error);
      alert(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSearching(false);
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
        {/* Welcome Section */}
        <section className="py-12 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Welcome back, {user.username}! 👋
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover and bookmark the latest research papers in AI & Data Science
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Research Papers
                </CardTitle>
                <CardDescription>
                  Find papers across 40+ AI/ML domains with our intelligent search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search for papers on neural networks, transformers, GANs..."
                    className="flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-8"
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
                
                {/* Quick Search Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Quick searches:</span>
                  {["Transformers", "GANs", "Reinforcement Learning", "Computer Vision"].map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch();
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        {allPapers.length > 0 && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Search Results ({allPapers.length})</h2>
                <p className="text-muted-foreground">Showing {getCurrentPagePapers().length} papers on page {currentPage} of {totalPages}</p>
              </div>



              <div className="grid gap-4">
                {getCurrentPagePapers().map((paper) => (
                  <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {/* <Badge variant="secondary">{paper.source}</Badge> */}
                            <Badge variant="outline">{paper.keyword}</Badge>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-2">
                            {paper.title}
                          </h3>
                          
                          {paper.abstract && (
                            <p className="text-muted-foreground mb-3">
                              {paper.abstract}
                            </p>
                          )}
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
                            onClick={() => handleBookmark(paper)}
                            title={bookmarks.some(b => b.id === paper.id) ? "Remove Bookmark" : "Add Bookmark"}
                            className={bookmarks.some(b => b.id === paper.id) ? "text-yellow-600 bg-yellow-50" : ""}
                          >
                            <Bookmark className={`h-4 w-4 ${bookmarks.some(b => b.id === paper.id) ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMoreResults && (
                <div className="mt-8 text-center">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                    size="lg"
                    className="px-8"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Loading more papers...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Load 10 More Papers
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Empty State */}
        {allPapers.length === 0 && !isSearching && (
          <section className="py-16">
            <div className="container mx-auto px-4 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Your Research Journey</h3>
              <p className="text-muted-foreground mb-6">
                Search for papers to discover the latest research in AI and Data Science
              </p>
            </div>
          </section>
        )}
      </main>
                    {/* Pagination Tabs */}
                    <div className="mb-6">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="px-2 text-muted-foreground">...</span>
                        <Button
                          variant={currentPage === totalPages ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-10"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
      <Footer />
    </div>
  );
}