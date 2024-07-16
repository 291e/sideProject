"use client";

import React from "react";
import Input from "../../components/input";
import Button from "../../components/button";
import SocialLogin from "../../components/social-login";
import { redirect } from "next/navigation";
import { useFormState } from "react-dom";

export default function LogIn() {
  //   const [state, dispatch] = useFormState(login, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">MovieProject</h1>
        <h2 className="text-xl">
          이메일과 비밀번호를 입력해 로그인을 진행하세요!
        </h2>
      </div>
      <form className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          //   errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          //   minLength={}
          //   maxLength={}
          //   errors={state?.fieldErrors.password}
        />
        <Button text="Log In" />
      </form>

      <SocialLogin />
    </div>
  );
}
