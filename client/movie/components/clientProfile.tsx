"use client";

import React from "react";

interface ClientProfileProps {
	username: string;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ username }) => {
	const handleLogout = async () => {
		await fetch("/api/logout", {
			method: "POST",
		});
		document.cookie = "token=; Max-Age=0; path=/";
		window.location.href = "/";
	};

	return (
		<div>
			<h1>어서오세요, {username}.</h1>
			<button onClick={handleLogout}>로그아웃</button>
		</div>
	);
};

export default ClientProfile;
