"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/lib/actions";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="mt-2 min-h-[44px] w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{pending ? "Authenticating…" : "Enter"}
		</button>
	);
}

export default function LoginForm() {
	const [state, formAction] = useActionState(loginAction, { success: false });

	return (
		<form action={formAction} className="flex flex-col gap-5">
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
				{state.errors?.password && (
					<p className="mt-2 text-center text-xs text-red-400">
						{state.errors.password[0]}
					</p>
				)}
			</div>

			{state.errors?._form && (
				<p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs text-red-400">
					{state.errors._form[0]}
				</p>
			)}

			<SubmitButton />
		</form>
	);
}
