"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

export default function HiddenAdminLink({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const clickTimes = useRef<number[]>([]);

	const handleClick = useCallback(() => {
		const now = Date.now();
		// Keep only clicks from the last 2 seconds
		clickTimes.current = clickTimes.current.filter((time) => now - time < 2000);
		clickTimes.current.push(now);

		if (clickTimes.current.length >= 5) {
			clickTimes.current = []; // reset
			router.push("/admin");
		}
	}, [router]);

	const linkRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = linkRef.current;
		if (!el) return;
		el.addEventListener("click", handleClick);
		return () => el.removeEventListener("click", handleClick);
	}, [handleClick]);

	return (
		<div ref={linkRef} className="cursor-default select-none">
			{children}
		</div>
	);
}
