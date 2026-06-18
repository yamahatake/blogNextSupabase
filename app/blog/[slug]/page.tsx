import { createClient } from "@/lib/supabase/server";
import { CommentSection } from "@/components/blog/comment-section";
import { type Comment } from "@/lib/types";
import { notFound } from "next/navigation";
import MoreActions from "@/components/ui/more-actions";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: post }, { data: authData }] = await Promise.all([
    supabase.from("posts").select("*").eq("slug", slug).single(),
    supabase.auth.getClaims(),
  ]);

  if (!post) notFound();

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  const userId = (authData?.claims?.sub as string) ?? null;
  const userEmail = (authData?.claims?.email as string) ?? null;

  const publishPost = () => {

  }

  return (
    <article className="max-w-2xl mx-auto w-full flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-4 justify-between">
          <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>
          <MoreActions>
            <button className="block w-full text-left px-2 py-1 hover:bg-muted">Edit</button>
            <button className="block w-full text-left px-2 py-1 hover:bg-muted">Delete</button>
            {!post.published && (
              <button className="block w-full text-left px-2 py-1 hover:bg-muted">Publish</button>
            )}
          </MoreActions>
        </div>
        <p className="text-sm text-muted-foreground">
          By {post.author_email} &middot;{" "}
          {new Date(post.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>

      <CommentSection
        postId={post.id}
        initialComments={(comments as Comment[]) ?? []}
        userId={userId}
        userEmail={userEmail}
      />
    </article>
  );
}
