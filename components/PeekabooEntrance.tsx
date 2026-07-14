"use client";

import { motion } from "framer-motion";

export default function PeekabooEntrance({
	children,
	className,
	delay = 0,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}) {
	return (
		<motion.div
			className={className}
			initial={{ y: 80, opacity: 0, rotate: 15 }}
			animate={{ y: 0, opacity: 1, rotate: 0 }}
			transition={{
				type: "spring",
				stiffness: 260,
				damping: 20,
				delay: delay,
			}}
		>
			{children}
		</motion.div>
	);
}
