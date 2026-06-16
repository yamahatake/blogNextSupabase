import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/blog/post-form";
import { redirect } from "next/navigation";

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">New Post</h1>
      <PostForm />
    </div>
  );
}
