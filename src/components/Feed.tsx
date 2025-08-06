"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "./ui/button";
import { TrendingUp, Plus } from "lucide-react";
import { toast } from "sonner";
import { env } from "~/env";
import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { auth } from "~/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Card from "./Card";
import { useRouter } from "next/navigation";
import PostFilters from "./PostFilters";
import type { FilterType } from "./PostFilters";
import GoogleAuth from "./GoogleAuth";
import CreatePostOverlay from "./CreatePostOverlay";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  likes: number;
  commentCount?: number;
  createdAt: string;
  likedByCurrentUser: boolean;
  author: {
    id: string;
    username: string;
  }
}

interface ApiResponse<T> {
  status: string;
  msg: T;
}

// Skeleton Components
const PostSkeleton = () => (
  <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 animate-pulse">
    {/* Header Skeleton */}
    <div className="p-6 pb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="h-6 bg-white/10 rounded mb-2 w-3/4"></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-20"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-16"></div>
            </div>
          </div>
        </div>
        <div className="h-8 w-8 bg-white/10 rounded-lg"></div>
      </div>
    </div>

    {/* Image Skeleton */}
    <div className="px-6 pb-4">
      <div className="h-48 bg-white/10 rounded-xl"></div>
    </div>

    {/* Content Skeleton */}
    <div className="px-6 pb-6">
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
        <div className="h-4 bg-white/10 rounded w-4/6"></div>
      </div>
      
      {/* Footer Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-white/10 rounded"></div>
          <div className="h-4 bg-white/10 rounded w-12"></div>
        </div>
        <div className="h-3 bg-white/10 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const FeedSkeleton = () => (
  <div className="min-h-screen w-full bg-black">
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Create Post Section Skeleton */}
      <div className="mb-8 sm:mb-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="h-8 bg-white/10 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-64 mx-auto"></div>
          </div>
          
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8">
            <div className="space-y-6">
              {/* Title Skeleton */}
              <div>
                <div className="h-4 bg-white/10 rounded w-16 mb-3"></div>
                <div className="h-10 bg-white/10 rounded"></div>
              </div>

              {/* Description Skeleton */}
              <div>
                <div className="h-4 bg-white/10 rounded w-24 mb-3"></div>
                <div className="h-32 bg-white/10 rounded"></div>
              </div>

              {/* Type Skeleton */}
              <div>
                <div className="h-4 bg-white/10 rounded w-20 mb-3"></div>
                <div className="h-10 bg-white/10 rounded"></div>
              </div>

              {/* File Upload Skeleton */}
              <div>
                <div className="h-4 bg-white/10 rounded w-24 mb-3"></div>
                <div className="h-12 bg-white/10 rounded border border-dashed border-white/20"></div>
              </div>

              {/* Button Skeleton */}
              <div className="h-12 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section Skeleton */}
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="h-5 w-5 bg-white/10 rounded"></div>
            <div className="h-6 bg-white/10 rounded w-32"></div>
          </div>
          <div className="h-4 bg-white/10 rounded w-48 mx-auto mt-2"></div>
        </div>

        {/* Posts Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("hot");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreatePostOverlay, setShowCreatePostOverlay] = useState(false);
  const [showCreatePostSection, setShowCreatePostSection] = useState(false);
  const [hasCompletedUsernameSetup, setHasCompletedUsernameSetup] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleUsernameSaved = () => {
    console.log("handleUsernameSaved called - setting showCreatePostSection to true");
    setShowCreatePostSection(true);
    setHasCompletedUsernameSetup(true);
    console.log("State updated - showCreatePostSection: true, hasCompletedUsernameSetup: true");
  };

  // If user is authenticated, assume they have completed username setup
  useEffect(() => {
    console.log("Feed useEffect - user:", user, "hasCompletedUsernameSetup:", hasCompletedUsernameSetup, "showCreatePostSection:", showCreatePostSection);
    // Don't automatically assume they have completed setup
    // Let the GoogleAuth component handle this
  }, [user, hasCompletedUsernameSetup, showCreatePostSection]);

  const API: AxiosInstance = axios.create({
    baseURL: `${env.NEXT_PUBLIC_API_URL}`,
  });

  API.interceptors.request.use(async (config) => {
    const token = user ? await user.getIdToken() : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const fetchPosts = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log("Fetching posts with like states from database...");
      const { data } = await API.get<ApiResponse<Post[]>>("/post");
      console.log("Raw posts data from API:", data.msg);
      
      // Ensure each post has the correct like state from database
      const postsWithLikeStates = data.msg.map(post => {
        const processedPost = {
          ...post,
          likedByCurrentUser: post.likedByCurrentUser ?? false
        };
        console.log(`Post ${post.id} like state:`, {
          postId: post.id,
          title: post.title,
          likedByCurrentUser: processedPost.likedByCurrentUser,
          likes: processedPost.likes
        });
        return processedPost;
      });
      
      console.log("Final posts with processed like states:", postsWithLikeStates);
      setPosts(postsWithLikeStates);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  const loadMorePosts = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500); // Simulate loading delay
  };

  const handleLike = async (postId: string): Promise<void> => {
    if (!user) {
      toast.error("Please login to like posts", {
        action: {
          label: "Sign In",
          onClick: () => {
            // You could add a modal or redirect to login here
            toast.info("Use the sign-in button above to login");
          },
        },
      });
      return;
    }

    try {
      console.log("Liking post:", postId);
      
      // Get current post state before optimistic update
      const currentPost = posts.find(p => p.id === postId);
      console.log(`Current state for post ${postId}:`, {
        postId: currentPost?.id,
        title: currentPost?.title,
        likedByCurrentUser: currentPost?.likedByCurrentUser,
        likes: currentPost?.likes
      });
      
      // Optimistically update the UI immediately
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
              ...p,
              likes: p.likedByCurrentUser ? p.likes - 1 : p.likes + 1,
              likedByCurrentUser: !p.likedByCurrentUser,
            }
            : p,
        ),
      );

      console.log(`Optimistic update applied for post ${postId}`);

      // Make the API call
      await API.post(`/like/${postId}`, {});
      console.log("Like API call successful, fetching updated like state from database");
      
      // Fetch the individual post's like state from database to ensure accuracy
      await fetchIndividualPostLikeState(postId);
    } catch (err: unknown) {
      console.error("Error liking post:", err);
      const axiosError = err as AxiosError<{ msg?: string }>;
      toast.error(axiosError.response?.data?.msg ?? "Error liking post");
      
      // Revert the optimistic update on error
      setTimeout(() => {
        console.log(`Reverting optimistic update for post ${postId}`);
        void fetchIndividualPostLikeState(postId);
      }, 100);
    }
  };

  const fetchIndividualPostLikeState = async (postId: string): Promise<void> => {
    try {
      console.log(`Fetching like state for post ${postId} from database`);
      const { data } = await API.get<ApiResponse<Post>>(`/post/${postId}`);
      console.log(`Raw individual post data for ${postId}:`, data.msg);
      
      const updatedPost = {
        ...data.msg,
        likedByCurrentUser: data.msg.likedByCurrentUser ?? false
      };
      
      console.log(`Processed like state for post ${postId}:`, {
        postId: updatedPost.id,
        title: updatedPost.title,
        likedByCurrentUser: updatedPost.likedByCurrentUser,
        likes: updatedPost.likes
      });
      
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
              ...p,
              likes: updatedPost.likes,
              likedByCurrentUser: updatedPost.likedByCurrentUser,
            }
            : p,
        ),
      );
      console.log(`Successfully updated like state for post ${postId} in state`);
    } catch (error) {
      console.error(`Error fetching like state for post ${postId}:`, error);
    }
  };

  // Only fetch posts once on mount, not on filter changes
  useEffect(() => {
    void fetchPosts();
  }, []); // Empty dependency array - only runs once

  // Refresh posts when user authentication state changes
  useEffect(() => {
    if (user) {
      console.log("User authenticated, refreshing posts to get like states");
      void refreshAllPostLikeStates();
      
      // Check if user already exists in backend and show create post form
      const checkUserExists = async () => {
        try {
          const token = await user.getIdToken();
          await axios.get(`${env.NEXT_PUBLIC_API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("User exists in backend, showing create post form");
          setHasCompletedUsernameSetup(true);
          setShowCreatePostSection(true);
        } catch (err: unknown) {
          if (
            typeof err === "object" &&
            err !== null &&
            "response" in err &&
            (err as AxiosError).response?.status === 404
          ) {
            console.log("User not found (404), needs to set username");
            // User doesn't exist, keep showing username setup
          } else {
            console.error("Error checking user existence:", err);
          }
        }
      };
      
      void checkUserExists();
    } else {
      console.log("User logged out, clearing posts");
      setPosts([]);
      setHasCompletedUsernameSetup(false);
      setShowCreatePostSection(false);
    }
  }, [user]); // Refresh when user state changes

  const refreshAllPostLikeStates = async (): Promise<void> => {
    try {
      console.log("Refreshing all post like states from database");
      const { data } = await API.get<ApiResponse<Post[]>>("/post");
      console.log("Raw posts data for refresh:", data.msg);
      
      // Update posts with fresh like states from database
      const postsWithFreshLikeStates = data.msg.map(post => {
        const processedPost = {
          ...post,
          likedByCurrentUser: post.likedByCurrentUser ?? false
        };
        console.log(`Refresh - Post ${post.id} like state:`, {
          postId: post.id,
          title: post.title,
          likedByCurrentUser: processedPost.likedByCurrentUser,
          likes: processedPost.likes
        });
        return processedPost;
      });
      
      setPosts(postsWithFreshLikeStates);
      console.log("All post like states refreshed from database:", postsWithFreshLikeStates);
    } catch (error) {
      console.error("Error refreshing post like states:", error);
    }
  };


  // Reset pagination when filter changes (without re-fetching)
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
  }, [activeFilter]);

  // Memoize sorted posts separately from pagination
  const sortedAllPosts = useMemo(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return [...posts].sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      const aAge = now.getTime() - aDate.getTime();
      const bAge = now.getTime() - bDate.getTime();

      switch (activeFilter) {
        case "hot":
          // Hot: combination of likes and recency (Reddit's hot algorithm simplified)
          const aScore = a.likes + (aAge < oneDayAgo.getTime() ? 10 : 0);
          const bScore = b.likes + (bAge < oneDayAgo.getTime() ? 10 : 0);
          return bScore - aScore;

        case "new":
          // New: most recent first
          return bDate.getTime() - aDate.getTime();

        case "best":
          // Best: highest engagement (likes + comments)
          const aEngagement = a.likes + (a.commentCount ?? 0);
          const bEngagement = b.likes + (b.commentCount ?? 0);
          return bEngagement - aEngagement;

        default:
          return 0;
      }
    });
  }, [posts, activeFilter]);

  // Memoize paginated posts
  const sortedPosts = useMemo(() => {
    const postsPerPage = 25; // Increased from 10 to 25 posts per page
    const startIndex = 0;
    const endIndex = currentPage * postsPerPage;
    const paginatedPosts = sortedAllPosts.slice(startIndex, endIndex);
    
    // Update hasMore based on whether there are more posts to show
    setHasMore(endIndex < sortedAllPosts.length);
    
    return paginatedPosts;
  }, [sortedAllPosts, currentPage]);

  // Show skeleton while loading
  if (loading) {
    return <FeedSkeleton />;
  }

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Create Post Section */}
        {((user && hasCompletedUsernameSetup) ?? false) || showCreatePostSection ? (
          <div className="mb-4 sm:mb-8">
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 sm:mb-6 text-center">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Share Your Thoughts
                </h2>
                <p className="mt-2 text-gray-400">
                  Post memes, updates, or anything election-related
                </p>
              </div>
              
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8">
                <div className="text-center space-y-6">
                  <div className="mb-6">
                    <div className="mx-auto h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                      <Plus size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Create a New Post
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Share your thoughts, memes, and updates about campus politics
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => setShowCreatePostOverlay(true)}
                    className="bg-white text-black hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus size={18} />
                    Create Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 sm:mb-8">
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 sm:mb-6 text-center">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  Share Your Thoughts
                </h2>
                <p className="mt-2 text-gray-400">
                  {user ? "Complete your setup to post" : "Login to post and show your support"}
                </p>
              </div>
              
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 sm:p-8">
                <div className="text-center space-y-6">
                  <div className="mb-6">
                    <div className="mx-auto h-16 w-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {user ? "Complete Setup" : "Join the Discussion"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {user ? "Set your username to start posting" : "Sign in to share your thoughts, memes, and updates about campus politics"}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <GoogleAuth onUsernameSaved={handleUsernameSaved} />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      {user ? "Complete your account setup" : "Sign in to share your thoughts and support"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Post Overlay */}
        <CreatePostOverlay
          isOpen={showCreatePostOverlay}
          onClose={() => setShowCreatePostOverlay(false)}
          onPostCreated={fetchPosts}
        />

        {/* Posts Section */}
        <div className="space-y-6 sm:space-y-8">
          {/* Filter Component */}
          <PostFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            postCount={sortedPosts.length}
          />

          {/* Posts Grid */}
          {sortedPosts.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sortedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/post/${post.id}`)}
                    className="cursor-pointer transform hover:scale-[1.02] transition-transform duration-200"
                  >
                    <Card
                      title={post.title}
                      description={post.description}
                      imageUrl={post.imageUrl}
                      likes={post.likes}
                      commentCount={post.commentCount}
                      likedByCurrentUser={post.likedByCurrentUser}
                      onLike={() => handleLike(post.id)}
                      author={post.author?.username ? post.author?.username : "Anonymous"}
                      date={post.createdAt}
                      isAuthenticated={!!user}
                    />
                  </div>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMorePosts}
                    disabled={loadingMore}
                    className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <TrendingUp size={16} />
                        Load More Posts
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {sortedPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto max-w-md">
                <div className="mb-6">
                  <div className="mx-auto h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
                    <TrendingUp size={24} className="text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-400">
                  Be the first to share something about the elections!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;
