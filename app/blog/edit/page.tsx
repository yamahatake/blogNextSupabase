import { createClient } from "@/lib/supabase/server";
import { PostFormEdit } from "@/components/blog/post-form-edit";
import { redirect } from "next/navigation";

export default async function EditPostPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostFormEdit />
    </div>
  );
}
