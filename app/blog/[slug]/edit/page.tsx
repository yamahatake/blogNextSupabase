import { createClient } from "@/lib/supabase/server";
import { PostFormEdit } from "@/components/blog/post-form-edit";
import { redirect, notFound } from "next/navigation";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({params}: EditPostPageProps) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const { slug } = await params;

  const [{ data: post }] = await Promise.all([
    supabase.from("posts").select("*").eq("slug", slug).single(),
    supabase.auth.getClaims(),
  ]);

  if (!data?.claims) {
    redirect("/auth/login");
  }

  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostFormEdit post={post} />
    </div>
  );
}
