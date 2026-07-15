import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	const sessionCookie =
		request.cookies.get("better-auth.session_token") ||
		request.cookies.get("__Secure-better-auth.session_token");

	const path = request.nextUrl.pathname;
	const isLoginPage = path === "/admin";

	if (!sessionCookie) {
		console.log("[PROXY] No session cookie. Path:", path);
		if (!isLoginPage) {
			return NextResponse.redirect(new URL("/admin", request.url));
		}
		return NextResponse.next();
	}

	try {
		const res = await fetch(new URL("/api/auth/get-session", request.url), {
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		});

		const sessionData = await res.json().catch(() => null);
		const isValidSession = !!sessionData?.session;

		if (!isValidSession && !isLoginPage) {
			return NextResponse.redirect(new URL("/admin", request.url));
		}

		if (isValidSession && isLoginPage) {
			return NextResponse.redirect(new URL("/admin/posts", request.url));
		}
	} catch {
		if (!isLoginPage) {
			return NextResponse.redirect(new URL("/admin", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin", "/admin/posts/:path*", "/admin/comments/:path*"],
};
