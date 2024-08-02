"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { fetchPost } from "@/app/services/api";
import Link from "next/link";

const PostPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, error, isLoading } = useQuery(
    ["post", id],
    () => fetchPost(id as string),
    {
      enabled: !!id,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching post</div>;

  const post = data?.data?.post;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p>{post.content}</p>
      <Link href={`/posts/edit/${id}?id=${id}`} className="text-blue-500">
        Edit
      </Link>
    </div>
  );
};

export default PostPage;
