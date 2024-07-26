"use client";

import React from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps {
	text: string;
}

export default function Button({ text }: ButtonProps) {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="btn-meta h-10 disabled:bg-neutral-400 disabled:text-neutral-300
      disabled:cursor-not-allowed">
			{pending ? "로딩 중" : text}
		</button>
	);
}
