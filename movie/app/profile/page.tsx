import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientProfile from "@/components/clientProfile";

async function fetchProfile(token: string) {
	const res = await fetch("http://localhost:8080", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (res.status === 401) {
		redirect("/login");
	}

	const data = await res.json();
	return data;
}

export default async function Profile() {
	const cookieStore = cookies();
	const token = cookieStore.get("token")?.value || "";

	const data = await fetchProfile(token);

	if (!data) {
		return <div>Loading...</div>;
	}

	const username = data.username;

	return <ClientProfile username={username} />;
}
