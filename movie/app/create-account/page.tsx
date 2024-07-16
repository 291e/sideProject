"use client";

import React from "react";
import Input from "../../components/input";
import FormButton from "../../components/button";
import SocialLogin from "../../components/social-login";
import { useFormState } from "react-dom";

export default function CreateAccount() {
  //   const [state, action] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">MovieCommunity</h1>
        <h2 className="text-xl">회원가입을 진행하세요!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          //   errors={state?.fieldErrors.username}
          //   minLength={USERNAME_MIN_LENGTH}
        />
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
          //   errors={state?.fieldErrors.password}
          //   minLength={}
          //   maxLength={}
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          //   errors={state?.fieldErrors.confirmPassword}
        />
        <FormButton text="Create account" />
      </form>
      <SocialLogin />
    </div>
  );
}
