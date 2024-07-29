"use client";

import { CubeIcon as SolidCube } from "@heroicons/react/24/solid";
import { CubeTransparentIcon as OutlineCube } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-3 border-neutral-600 border-t px-5 py-3 *:text-white bg-neutral-800">
      <Link href="/movie" className="flex flex-col items-center gap-px">
        {pathname === "/movie" ? (
          <SolidCube className="size-7" />
        ) : (
          <OutlineCube className="size-7" />
        )}
        <span>영화</span>
      </Link>
      <Link href="/posts" className="flex flex-col items-center gap-px">
        {pathname === "/posts" ? (
          <SolidCube className="size-7" />
        ) : (
          <OutlineCube className="size-7" />
        )}
        <span>게시판</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-px">
        {pathname === "/profile" ? (
          <SolidCube className="size-7" />
        ) : (
          <OutlineCube className="size-7" />
        )}
        <span>프로필</span>
      </Link>
    </div>
  );
}
