"use client";

import { useQuery } from "react-query";
import { fetchPosts } from "@/app/services/api";
import Link from "next/link";

const PostsPage = () => {
  const { data, error, isLoading } = useQuery("posts", fetchPosts);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching posts</div>;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <Link href="/posts/create" className="text-blue-500">
        Create a new post
      </Link>
      <ul>
        {data?.data?.posts.map((post: any) => (
          <li key={post.post_id}>
            <Link href={`/posts/${post.post_id}?id=${post.post_id}`} className="text-blue-500">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsPage;
