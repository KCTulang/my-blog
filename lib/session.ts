import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function verifySession() {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		return session ? session.user : null;
	} catch (_error) {
		return null;
	}
}

export async function createSession() {
	// Left empty or throw error, Better Auth handles this via signIn
}

export async function deleteSession() {
	// Better Auth handles this via signOut, but we can do it server-side if needed
	// Actually, calling signOut from the client is preferred.
}
