"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileProps {
	username: string;
}

async function fetchProfile(token: string): Promise<ProfileProps | null> {
	const res = await fetch("http://localhost:8000/users/profile", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (res.status === 401) {
		return null;
	}

	const data = await res.json();
	return data;
}

export default function Profile() {
	const [username, setUsername] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem("token") || "";

			const data = await fetchProfile(token);
			if (data === null) {
				// Redirect to login if profile fetch fails
				router.push("/login");
			} else {
				setUsername(data.username);
			}
		};

		fetchData();
	}, [router]);

	const handleLogout = async () => {
		await fetch("/api/logout", {
			method: "POST",
		});
		localStorage.removeItem("token");
		router.push("/");
	};

	if (username === null) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>어서오세요, {username}.</h1>
			<button onClick={handleLogout}>로그아웃</button>
		</div>
	);
}
