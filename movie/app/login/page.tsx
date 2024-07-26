"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Input from "../../components/input";
import Button from "../../components/button";
import SocialLogin from "../../components/social-login";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

export default function LogIn() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      document.cookie = `session=${data.session}; path=/`;
      router.push("/profile");
    } else {
      setError(data.message);
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
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
