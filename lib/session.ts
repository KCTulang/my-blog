import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("24h")
		.sign(key);
}

export async function decrypt(input: string): Promise<unknown> {
	const { payload } = await jwtVerify(input, key, {
		algorithms: ["HS256"],
	});
	return payload;
}

export async function createSession() {
	const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const session = await encrypt({ admin: true, expires });

	const cookieStore = await cookies();
	cookieStore.set("session", session, {
		expires,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
	});
}

export async function verifySession() {
	const cookieStore = await cookies();
	const session = cookieStore.get("session")?.value;
	if (!session) return null;

	try {
		const payload = await decrypt(session);
		return payload;
	} catch (_error) {
		return null;
	}
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete("session");
}
