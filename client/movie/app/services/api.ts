import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const fetchPosts = () => api.get("/posts");
export const fetchPost = (id: string) => api.get(`/posts/${id}`);
export const createPost = (post: any, token: string) =>
  api.post("/posts", post, { headers: { Authorization: `Bearer ${token}` } });
export const updatePost = (id: string, post: any, token: string) =>
  api.put(`/posts/${id}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deletePost = (id: string, token: string) =>
  api.delete(`/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
