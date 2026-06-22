"use client";

import MoreActions from "@/components/ui/more-actions";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PostActions = ({ post }: { post: Post }) => {
  const supabase = createClient();
  const router = useRouter();

  const deletePost = () => {
    console.log("Delete post", post.id);
  }

  const publishPost = async () => {
    const { error } = await supabase.from("posts").update({"published": true}).eq("id", post.id);
    if (error) {
      console.log(error)
    } else {
      router.push(`/`);
      router.refresh();
    }
  }

  return (
    <MoreActions>
      <div>
        <Button variant="ghost" size={'sm'} className="flex w-full justify-start rounded-none">
          <Link href={`/blog/${post.slug}/edit`}>
            Edit
          </Link>
        </Button>
        <Button variant="ghost" size={'sm'} className="flex w-full justify-start rounded-none" onClick={() => deletePost()}>
          Delete
        </Button>
        {!post.published && (
          <Button variant="ghost" size={'sm'} className="flex w-full justify-start rounded-none" onClick={() => publishPost()}>
            Publish
          </Button>
        )}
      </div>
    </MoreActions>
  )
}

export default PostActions;