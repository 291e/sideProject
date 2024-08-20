"use client";

import { useQuery } from "react-query";
import { fetchPosts } from "@/app/services/api";
import Link from "next/link";

const PostsPage = () => {
  const { data, error, isLoading } = useQuery("posts", fetchPosts);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching posts</div>;
  return (
    <div className="h-screen flex flex-col p-4">
      <div className="flex justify-between items-center my-8">
        <h1 className="text-2xl font-bold text-black">게시판</h1>
        <button className="flex justify-center items-center bg-violet-100 p-1 px-3 rounded-full shadow-sm">
          <Link href="/posts/create" className="text-neutral-500">
            ✏️ 작성
          </Link>
        </button>
      </div>
      <ul className="text-black grid grid-cols-3 gap-4">
        {data?.data?.posts.map((post: any) => (
          <li key={post.id} className="aspect-1 bg-neutral-100 rounded-xl p-4 ">
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-2">
                <span className="font-semibold">{post.title}</span>
                <div className="border-[1px] rounded-md" />
                <span className="text-sm">{post.content}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>{post.owner}</span>
                <span>{post.createAt}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsPage;
