"use client";

import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { fetchPost, updatePost } from "@/app/services/api";
import { useRouter, useSearchParams } from "next/navigation";

const EditPostPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data, isLoading, error } = useQuery(
    ["post", id],
    () => fetchPost(id as string),
    {
      enabled: !!id,
      onSuccess: (data) => {
        setTitle(data.data.title);
        setContent(data.data.content);
      },
    }
  );

  const mutation = useMutation(
    (updatedPost: any) => {
      const token = localStorage.getItem("token") || "";
      return updatePost(id as string, updatedPost, token);
    },
    {
      onSuccess: () => {
        router.push(`/posts/${id}`);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, content });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching post</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
