"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Input from "../../../components/input";
import FormButton from "../../../components/button";
import SocialLogin from "../../../components/social-login";
import { useRouter } from "next/navigation";

interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CreateAccount() {
  const [form, setForm] = useState<SignupForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:8000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.status === 200) {
      setSuccess("Account created successfully");
      setTimeout(() => {
        router.push("/login");
      });
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 font-medium">
        <h1 className="text-2xl">MovieCommunity</h1>
        <h2 className="text-xl">회원가입을 진행하세요!</h2>
      </div>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          value={form.username}
          onChange={handleChange}
        />
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
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <FormButton text="Create account" />
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
      <SocialLogin />
    </div>
  );
}
