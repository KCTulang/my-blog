"use client";

import { motion } from "framer-motion";

interface FadeInUpProps {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}

export default function FadeInUp({
	children,
	className,
	delay = 0,
}: FadeInUpProps) {
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{
				duration: 0.6,
				ease: [0.25, 0.1, 0.25, 1],
				delay: delay,
			}}
		>
			{children}
		</motion.div>
	);
}
