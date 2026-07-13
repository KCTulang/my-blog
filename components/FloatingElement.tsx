"use client";

import { motion } from "framer-motion";

interface FloatingElementProps {
	children: React.ReactNode;
	className?: string;
	yOffset?: number; // How far up/down it floats
	duration?: number; // How long one cycle takes
	delay?: number; // Optional delay before starting
}

export default function FloatingElement({
	children,
	className,
	yOffset = 12,
	duration = 4,
	delay = 0,
}: FloatingElementProps) {
	return (
		<motion.div
			className={className}
			animate={{ y: [0, -yOffset, 0] }}
			transition={{
				duration: duration,
				repeat: Number.POSITIVE_INFINITY,
				ease: "easeInOut",
				delay: delay,
			}}
		>
			{children}
		</motion.div>
	);
}
