import Link from "next/link";
import React from "react";

export default function SocialLogin() {
  return (
    <>
      <div className="w-full h-px bg-neutral-500" />
      <div className="flex flex-col gap-3">
        <Link
          className="btn-meta flex h-10 items-center justify-center gap-2 hover:ring-2 hover:ring-violet-300"
          href="/github/start"
        >
          <span>
            <div className="bg-slate-500 rounded-full size-6" />
          </span>
          <span>Continue with GitHub</span>
        </Link>
        <Link
          className="btn-meta flex h-10 items-center justify-center gap-2 hover:ring-2 hover:ring-violet-300"
          href="/github/start"
        >
          <span className="size-6">💬</span>
          <span>Continue with SMS</span>
        </Link>
      </div>
    </>
  );
}
