"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Input from "../../../components/input";
import Button from "../../../components/button";
import SocialLogin from "../../../components/social-login";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

export default function LogIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const { token } = data;

      localStorage.setItem("token", token);

      router.push("/profile");
    } catch (error) {
      setError("Login failed");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 font-medium">
        <h1 className="text-2xl">MovieProject</h1>
        <h2 className="text-xl">
          이메일과 비밀번호를 입력해 로그인을 진행하세요!
        </h2>
      </div>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
        />
        <Button text="Log In" />
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <SocialLogin />
    </div>
  );
}
