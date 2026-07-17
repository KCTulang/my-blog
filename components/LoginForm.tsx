"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

import {
	incrementFailedAttempt,
	resetFailedAttempts,
} from "@/app/actions/auth";

export default function LoginForm() {
	const [pending, setPending] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setPending(true);
		setErrorMsg("");

		const formData = new FormData(e.currentTarget);
		const password = formData.get("password") as string;

		if (!password) {
			setErrorMsg("Password is required");
			setPending(false);
			return;
		}

		const email = "admin@loonary.com";

		const { error } = await authClient.signIn.email({
			email,
			password,
		});

		if (error) {
			if (error.message === "Invalid email or password") {
				await incrementFailedAttempt(email);
			}
			setErrorMsg(error.message || "Incorrect password");
			setPending(false);
		} else {
			await resetFailedAttempts(email);
			router.push("/admin/posts");
			router.refresh();
		}
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5">
			<div>
				<label htmlFor="password" className="sr-only">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					placeholder="Password"
					className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white placeholder-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
				/>
			</div>

			{errorMsg && (
				<p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs text-red-400">
					{errorMsg}
				</p>
			)}

			<button
				type="submit"
				disabled={pending}
				className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{pending ? "Authenticating…" : "Enter"}
			</button>
		</form>
	);
}
