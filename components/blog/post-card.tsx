"use client"

import { type Post } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import MoreActions from "@/components/ui/more-actions";

export function PostCard({ post, currentUserEmail }: { post: Post, currentUserEmail?: string }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
            {currentUserEmail === post.author_email && (
              <MoreActions>
                <button className="block w-full text-left px-2 py-1 hover:bg-muted">Edit</button>
                <button className="block w-full text-left px-2 py-1 hover:bg-muted">Delete</button>
              </MoreActions>
            )}

        </CardTitle>
        <p className="text-sm text-muted-foreground">
          By {post.author_email} &middot;{" "}
          {new Date(post.created_at).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-sm font-medium hover:underline self-start"
        >
          Read more &rarr;
        </Link>
      </CardContent>
    </Card>
  );
}
