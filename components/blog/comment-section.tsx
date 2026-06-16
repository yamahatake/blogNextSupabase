"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { type Comment } from "@/lib/types";
import Link from "next/link";

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  userId: string | null;
  userEmail: string | null;
}

export function CommentSection({
  postId,
  initialComments,
  userId,
  userEmail,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !userEmail) return;

    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: userId, user_email: userEmail, content })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      setComments((prev) => [...prev, data as Comment]);
      setContent("");
    }
    setIsLoading(false);
  };

  return (
    <section className="flex flex-col gap-6 border-t pt-8">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

      <div className="flex flex-col gap-5">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first!
          </p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-1 border-l-2 pl-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{comment.user_email}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        ))}
      </div>

      {userId ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-24 resize-y"
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={isLoading} className="self-end">
            {isLoading ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link href="/auth/login" className="underline underline-offset-4">
            Log in
          </Link>{" "}
          to leave a comment.
        </p>
      )}
    </section>
  );
}
