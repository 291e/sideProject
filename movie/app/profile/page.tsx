import React from "react";
import { cookies } from "next/headers";
import { redirect, useRouter } from "next/navigation";

interface ProfileProps {
  username: string;
}

async function fetchProfile(token: string) {
  const res = await fetch("http://localhost:8000/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    redirect("/login");
  }

  const data = await res.json();
  return data;
}

export default async function Profile() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value || "";

  const data = await fetchProfile(token);

  if (!data) {
    return <div>Loading...</div>;
  }

  const username = data.username;

  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/");
  };

  return (
    <div>
      <h1>어서오세요, {username}.</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}
