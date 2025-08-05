"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import type { AxiosError, AxiosInstance } from "axios";
import { env } from "~/env";
import Card from "../../../components/Card";
import { auth } from "~/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

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

const PostPage = ({ params }: PostProps) => {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
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
      const [postRes, commentsRes] = await Promise.all([
        API.get<ApiResponse<Post>>(`/post/${params.id}`),
        API.get<ApiResponse<Comment[]>>(`/comments/${params.id}`),
      ]);

      setPost(postRes.data.msg);
      setComments(commentsRes.data.msg);
    } catch (err) {
      toast.error("Failed to fetch post or comments");
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    void fetchData();
  }, [params.id]);

  const handleLike = async (postId: string): Promise<void> => {
    try {
      await API.post(`/like/${postId}`);
      setPost((prev) =>
        prev && prev.id === postId
          ? {
              ...prev,
              likes: prev.likedByCurrentUser ? prev.likes - 1 : prev.likes + 1,
              likedByCurrentUser: !prev.likedByCurrentUser,
            }
          : prev
      );
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ msg?: string }>;
      toast.error(axiosError.response?.data?.msg ?? "Error liking post");
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

      const res = await API.post<ApiResponse<Comment>>(
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
      <div className="min-w-fit" style={{ marginLeft: `${level * 1.5}rem` }}>
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-[12px]">{comment.author.username}</h1>
          <h1 className="text-[10px] text-[#888888]">
            {new Date(comment.createdAt).toLocaleString()}
          </h1>
        </div>
        <h1 className="text-[16px] w-full">{comment.content}</h1>
        <div className="flex flex-row items-center gap-4 justify-between w-full">
          <button
            className="text-[#9e9e9e]"
            onClick={() => setReplyBox(!replyBox)}
          >
            REPLY
          </button>
          {Array.isArray(comment.replies) && comment.replies.length > 0 && (
            <button
              className="text-[#9e9e9e]"
              onClick={() => setViewReplies(!viewReplies)}
            >
              {viewReplies ? "HIDE REPLIES" : "VIEW REPLIES"}
            </button>
          )}
        </div>

        {replyBox && (
          <div className="mt-2 w-full flex flex-col gap-2">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Add a public reply"
              className="bg-transparent w-full"
              style={{
                borderBottom: "1px solid #ffffff11",
                outline: "none",
              }}
            />
            <button
              className="self-end px-4 py-1 bg-blue-600 rounded-md text-white text-sm hover:bg-blue-500 transition"
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
              Post Reply
            </button>
          </div>
        )}

        {/* Render Nested Replies */}
        {viewReplies && Array.isArray(comment.replies) && (
          <div className="flex flex-col gap-4 mt-2">
            {comment.replies.map((reply) => (
              <CommentBox key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-white">
      {!params.id ? (
        <h1>No Post ID provided</h1>
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          {post && (
            <Card
              key={post.id}
              title={post.title}
              description={post.description}
              imageUrl={post.imageUrl}
              likes={post.likes}
              likedByCurrentUser={post.likedByCurrentUser}
              onLike={() => handleLike(post.id)}
              author={post.author?.username}
              date={post.createdAt}
            />
          )}

          <div className="mt-10 bg-[#16181B] rounded-md w-full lg:w-[50%] p-4 overflow-x-auto">
            <h1 className="text-lg font-bold">{comments.length} Comments</h1>

            {/* Add Comment Input */}
            <div className="mt-4 w-full flex flex-col gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a Public Comment"
                className="bg-transparent w-full"
                style={{
                  borderBottom: "1px solid #ffffff11",
                  outline: "none",
                }}
              />
              <button
                className="self-end px-4 py-1 bg-blue-600 rounded-md text-white text-sm hover:bg-blue-500 transition"
                onClick={() => {
                  if (newComment.trim()) {
                    void handleCreateComment({ content: newComment });
                    setNewComment("");
                  }
                }}
              >
                Post Comment
              </button>
            </div>

            <div className="flex flex-col items-start justify-center w-full gap-6 mt-6 overflow-visible">
              {comments.map((comment) => (
                <CommentBox key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
