import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const fetchPosts = (token: string) => api.get("/posts",{ headers: { Authorization: `Bearer ${token}` } });
export const fetchPost = (id: string, token: string) => api.get(`/posts/${id}`,{ headers: { Authorization: `Bearer ${token}` } });
export const createPost = (post: any, token: string) =>
  api.post("/posts", post, { headers: { Authorization: `Bearer ${token}` } });
export const updatePost = (id: string, post: any, token: string) =>
  api.put(`/posts/${id}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deletePost = (id: string, token: string) =>
  api.delete(`/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
