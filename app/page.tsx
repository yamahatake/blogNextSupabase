import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";
import { type Post } from "@/lib/types";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: posts }, { data: authData }] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false }),
    supabase.auth.getClaims(),
  ]);

  const isLoggedIn = !!authData?.claims;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog</h1>
        {isLoggedIn && (
          <Button asChild>
            <Link href="/blog/new">New Post</Link>
          </Button>
        )}
      </div>
      {posts && posts.length > 0 ? (
        <div className="grid gap-2">
          {(posts as Post[]).map((post) => (
            <PostCard key={post.id} post={post} currentUserEmail={authData?.claims.email} />
          ))}
        </div>
        
      ) : (
        <p className="text-muted-foreground">
          No posts yet.{" "}
          {isLoggedIn && (
            <Link href="/blog/new" className="underline underline-offset-4">
              Write the first one.
            </Link>
          )}
        </p>
      )}
    </div>
  );
}
