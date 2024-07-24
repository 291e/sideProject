import React from "react";

import { notFound, redirect } from "next/navigation";

export default async function Profile() {
  return (
    <div>
      <h1>어서오세요. </h1>
      <form>
        <button>Log Out</button>
      </form>
    </div>
  );
}
