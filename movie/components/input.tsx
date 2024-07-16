import React, { InputHTMLAttributes } from "react";

interface InputProps {
  errors?: string[];
  name: string;
}

export default function Input({
  errors = [],
  name,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-meta border-none placeholder:text-neutral-400 px-2"
        name={name}
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-meta font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
