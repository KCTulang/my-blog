"use client";

import { motion, useScroll, useTransform } from "framer-motion";

interface FloatingElementProps {
	children: React.ReactNode;
	className?: string;
	yOffset?: number; // How far up/down it floats
	xOffset?: number; // How far left/right it drifts
	duration?: number; // How long one cycle takes
	delay?: number; // Optional delay before starting
}

export default function FloatingElement({
	children,
	className,
	yOffset = 12,
	xOffset = 0,
	duration = 4,
	delay = 0,
}: FloatingElementProps) {
	const { scrollY } = useScroll();
	const parallaxY = useTransform(scrollY, [0, 1000], [0, 200]);

	return (
		<motion.div style={{ y: parallaxY }} className={className}>
			<motion.div
				className="w-full h-full"
				animate={{
					y: [0, -yOffset, 0],
					x: [0, xOffset, 0],
				}}
				transition={{
					duration: duration,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
					delay: delay,
				}}
			>
				{children}
			</motion.div>
		</motion.div>
	);
}
