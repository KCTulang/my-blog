"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

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

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: Easter egg link
		// biome-ignore lint/a11y/noStaticElementInteractions: Easter egg link
		<div onClick={handleClick} className="cursor-default select-none">
			{children}
		</div>
	);
}
