"use client";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { env } from "~/env";
import { auth } from "~/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { MessageCircle, Send, User, Calendar, Heart, TrendingUp, Clock, Star } from "lucide-react";
import Image from "next/image";

export const runtime = "edge";

interface PostProps {
  params: {
    id?: string;
  };
}

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  likes: number;
  likedByCurrentUser: boolean;
  createdAt: string;
  author: {
    id: string;
    username: string;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
  };
  replies?: Comment[];
}

interface ApiResponse<T> {
  status: string;
  msg: T;
}

// Skeleton Components
const PostDetailSkeleton = () => (
  <div className="min-h-screen w-full bg-black">
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden animate-pulse min-h-[600px] lg:h-[600px]">
          {/* Left Side - Post Skeleton */}
          <div className="lg:border-r border-white/10 h-auto lg:h-full">
            <div className="h-1/2 bg-white/10"></div>
            <div className="h-1/2 p-6">
              <div className="h-6 bg-white/10 rounded mb-2 w-3/4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-5/6"></div>
              </div>
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
          </div>
          
          {/* Right Side - Comments Skeleton */}
          <div className="flex flex-col h-auto lg:h-full overflow-auto">
            <div className="p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-white/10 rounded"></div>
                  <div className="h-5 bg-white/10 rounded w-32"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-white/10 rounded w-16"></div>
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }, (_, index) => (
                      <div key={index} className="h-6 bg-white/10 rounded w-12"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4 space-y-3">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-white/10"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-3 bg-white/10 rounded w-16"></div>
                      <div className="h-3 bg-white/10 rounded w-12"></div>
                    </div>
                    <div className="h-3 bg-white/10 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10 flex-shrink-0">
              <div className="h-8 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PostPage = ({ params }: PostProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentFilter, setCommentFilter] = useState<"new" | "top" | "old">("new");
  const [user] = useAuthState(auth);

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

  const fetchData = async () => {
    if (!params.id) return;

    try {
      setLoading(true);
      console.log(`Fetching individual post ${params.id} with like state from database`);
      
      const [postRes, commentsRes] = await Promise.all([
        API.get<ApiResponse<Post>>(`/post/${params.id}`),
        API.get<ApiResponse<Comment[]>>(`/comments/${params.id}`),
      ]);

      console.log(`Raw individual post data:`, postRes.data.msg);
      
      // Ensure like state is properly set from database
      const processedPost = {
        ...postRes.data.msg,
        likedByCurrentUser: Boolean(postRes.data.msg.likedByCurrentUser)
      };
      
      console.log(`Processed individual post like state:`, {
        postId: processedPost.id,
        title: processedPost.title,
        likedByCurrentUser: processedPost.likedByCurrentUser,
        likes: processedPost.likes
      });

      setPost(processedPost);
      setComments(commentsRes.data.msg);
      console.log(`Successfully set individual post and comments`);
      console.log(`Final post data for display:`, {
        id: processedPost.id,
        title: processedPost.title,
        likes: processedPost.likes,
        likedByCurrentUser: processedPost.likedByCurrentUser,
        hasImage: !!processedPost.imageUrl
      });
    } catch (err) {
      toast.error("Failed to fetch post or comments");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, [params.id]);

  // Refresh post when user authentication state changes to get correct like states
  useEffect(() => {
    if (user && params.id) {
      console.log("User authentication changed, refreshing post to get correct like states");
      void fetchData();
    }
  }, [user, params.id]);

  const handleLike = async (postId: string): Promise<void> => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    // If post is already liked, do nothing - prevent unlike action
    if (post && post.likedByCurrentUser === true) {
      console.log(`Post ${postId} is already liked, ignoring tap - no action taken`);
      return;
    }

    // Only proceed if post is not liked
    if (post && post.likedByCurrentUser === false) {
      console.log(`Post ${postId} is not liked, proceeding with like action`);
    }

    try {
      console.log("Processing like action for post:", postId);
      
      // Get current post state before optimistic update
      console.log(`Current state for post ${postId}:`, {
        postId: post?.id,
        title: post?.title,
        likedByCurrentUser: post?.likedByCurrentUser,
        likes: post?.likes
      });
      
      // Optimistically update the UI immediately
      setPost((prev) =>
        prev && prev.id === postId
          ? {
              ...prev,
              likes: prev.likedByCurrentUser ? prev.likes - 1 : prev.likes + 1,
              likedByCurrentUser: !prev.likedByCurrentUser,
            }
          : prev
      );

      console.log(`Optimistic update applied for post ${postId}`);

      // Make the API call to database
      await API.post(`/like/${postId}`, {});
      console.log("Like API call successful");
      
      // Only fetch from database if we need to verify the state
      // The optimistic update should be sufficient in most cases
      console.log(`Keeping optimistic update for post ${postId}, no additional DB call needed`);
    } catch (err: unknown) {
      console.error("Error liking post:", err);
      const axiosError = err as AxiosError<{ msg?: string }>;
      toast.error(axiosError.response?.data?.msg ?? "Error liking post");
      
      // Revert the optimistic update on error by refetching from database
      setTimeout(() => {
        console.log(`Reverting optimistic update for post ${postId}`);
        void fetchData();
      }, 100);
    }
  };

  const handleCreateComment = async ({
    content,
    parentId,
  }: {
    content: string;
    parentId?: string;
  }) => {
    try {
      if (!params.id) {
        toast.error("No post ID provided");
        return;
      }

      const token = user ? await user.getIdToken() : null;
      if (!token) throw new Error("Not authenticated");

      await API.post<ApiResponse<Comment>>(
        "/comments",
        {
          content,
          postId: params.id,
          parentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Comment posted!");
      void fetchData();
    } catch (err) {
      const axiosError = err as AxiosError<{ msg?: string }>;
      console.error("Comment creation failed:", axiosError);
      toast.error(axiosError.response?.data?.msg ?? "Error creating comment");
    }
  };



  // Count total comments including nested replies
  const totalCommentCount = useMemo(() => {
    const countNestedComments = (commentList: Comment[]): number => {
      return commentList.reduce((total, comment) => {
        let count = 1; // Count the current comment
        if (comment.replies && Array.isArray(comment.replies)) {
          count += countNestedComments(comment.replies); // Recursively count replies
        }
        return total + count;
      }, 0);
    };
    
    return countNestedComments(comments);
  }, [comments]);

  // Sort comments based on filter
  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      
      switch (commentFilter) {
        case "new":
          return bDate.getTime() - aDate.getTime();
        case "old":
          return aDate.getTime() - bDate.getTime();
        case "top":
          // For now, sort by date since we don't have comment likes
          // In the future, you could add likes to comments
          return bDate.getTime() - aDate.getTime();
        default:
          return 0;
      }
    });
  }, [comments, commentFilter]);

  const CommentBox = ({
    comment,
    level = 0,
  }: {
    comment: Comment;
    level?: number;
  }) => {
    const [replyBox, setReplyBox] = useState(false);
    const [viewReplies, setViewReplies] = useState(false);
    const [reply, setReply] = useState("");

    return (
      <div 
        className="group relative"
        style={{ marginLeft: `${level * 1.5}rem` }}
      >
        <div className="flex items-start gap-3 py-2 ">
          <div className="flex-shrink-0">
            <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <User size={12} className="text-red-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0 ">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-white">
                {comment.author.username}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-2">
              {comment.content}
            </p>
            
            <div className="flex items-center gap-4">
              <button
                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                onClick={() => setReplyBox(!replyBox)}
              >
                Reply
              </button>
              {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <button
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                  onClick={() => setViewReplies(!viewReplies)}
                >
                  {viewReplies ? "Hide Replies" : `${comment.replies.length} Replies`}
                </button>
              )}
            </div>

            {replyBox && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder:text-gray-400 focus:border-white/40 transition-colors resize-none text-sm"
                  rows={1}
                />
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    onClick={() => {
                      if (reply.trim()) {
                        void handleCreateComment({
                          content: reply,
                          parentId: comment.id,
                        });
                        setReply("");
                        setReplyBox(false);
                        setViewReplies(true);
                      }
                    }}
                  >
                    Post
                  </button>
                  <button
                    className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded hover:bg-white/20 transition-colors"
                    onClick={() => {
                      setReply("");
                      setReplyBox(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Render Nested Replies */}
        {viewReplies && Array.isArray(comment.replies) && (
          <div className="mt-2 space-y-1">
            {comment.replies.map((reply) => (
              <CommentBox key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Show skeleton while loading
  if (loading) {
    return <PostDetailSkeleton />;
  }

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {!params.id ? (
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-white mb-4">No Post ID provided</h1>
            <p className="text-gray-400">Please provide a valid post ID to view the content.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-y-scroll min-h-[600px] lg:h-[600px] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
              {/* Left Side - Post Image & Text */}
              <div className="lg:border-r border-white/10 h-auto lg:h-full">
                {post && (
                  <>
                    {/* Post Image - Fixed Height */}
                    {post.imageUrl ? (
                      <div className="h-[50%] relative">
                        <Image
                          src={post.imageUrl}
                          alt="Post"
                          width={800}
                          height={600}
                          className="w-full h-[100%] object-contain"
                        />
                      </div>
                    ) : (
                      <div className="hidden lg:flex h-1/2 bg-white/5 items-center justify-center">
                        <div className="text-center text-gray-400">
                          <MessageCircle size={48} className="mx-auto mb-4" />
                          <p>No image</p>
                        </div>
                      </div>
                    )}

                    {/* Post Text Content - Fixed Height */}
                    <div className="h-full lg:h-[50%] p-6 border-t border-white/10 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span className="truncate">{post.author?.username || "Anonymous"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{new Date(post.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleLike(post.id)} 
                          className="flex-shrink-0 ml-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Heart
                            size={20}
                            className={`transition-all duration-200 ${
                              post.likedByCurrentUser 
                                ? "fill-red-500 text-red-500 scale-110" 
                                : "text-gray-400 hover:text-red-400"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-0 mb-4">
                        <p className="text-gray-300 leading-relaxed">
                          {post.description}
                        </p>
                      </div>
                      
                      {/* Like count - Minimalistic */}
                      <div className="flex items-center gap-2 text-sm text-gray-400 pt-3 border-t border-white/10">
                        <Heart size={14} className={post.likedByCurrentUser ? "fill-red-500 text-red-500" : "text-gray-400"} />
                        <span>{post.likes || 0} like{(post.likes || 0) !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Side - Comments Only */}
              <div className="flex flex-col h-auto lg:h-full overflow-auto">
                {/* Comments Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={18} className="text-red-400" />
                      <h2 className="text-lg font-semibold text-white">
                        {totalCommentCount} Comment{totalCommentCount !== 1 ? 's' : ''}
                      </h2>
                    </div>
                    
                    {/* Comment Filter */}
                    {comments.length > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-xs text-gray-400">Sort by:</span>
                        <div className="flex flex-wrap gap-1">
                          {[
                            { id: "new", label: "New", icon: Clock },
                            { id: "top", label: "Top", icon: Star },
                            { id: "old", label: "Old", icon: TrendingUp },
                          ].map((filter) => {
                            const IconComponent = filter.icon;
                            const isActive = commentFilter === filter.id;
                            
                            return (
                              <button
                                key={filter.id}
                                onClick={() => setCommentFilter(filter.id as "new" | "top" | "old")}
                                className={`
                                  flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors whitespace-nowrap
                                  ${isActive 
                                    ? 'bg-red-500 text-white' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                  }
                                `}
                              >
                                <IconComponent size={12} />
                                <span>{filter.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments List - Scrollable with Custom Scrollbar */}
                <div className="border-t border-white/10 w-full" />
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                  <div className="p-4 space-y-1">
                    {sortedComments.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle size={24} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
                      </div>
                    ) : (
                      sortedComments.map((comment) => (
                        <CommentBox key={comment.id} comment={comment} />
                      ))
                    )}
                  </div>
                </div>

                {/* Add Comment Input - Fixed at Bottom */}
                {user && (
                  <div className="p-4 border-t border-white/10 flex-none lg:">
                    <div className="space-y-3">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-gray-400 focus:border-white/40 transition-colors resize-none text-sm"
                        rows={2}
                      />
                      <div className="flex justify-end">
                        <button
                          className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                          onClick={() => {
                            if (newComment.trim()) {
                              void handleCreateComment({ content: newComment });
                              setNewComment("");
                            }
                          }}
                        >
                          <Send size={14} />
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .scrollbar-thumb-white\/20 {
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        
        .scrollbar-thumb-white\/30 {
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }
        
        .scrollbar-track-transparent {
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
      `}</style>
    </div>
  );
};

export default PostPage;
