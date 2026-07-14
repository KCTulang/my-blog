"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
	const [isVisible, setIsVisible] = useState(false);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	// Smooth out the aura's movement
	const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
	const auraX = useSpring(mouseX, springConfig);
	const auraY = useSpring(mouseY, springConfig);

	useEffect(() => {
		// Only show on devices with a mouse
		if (window.matchMedia("(pointer: coarse)").matches) {
			return;
		}

		const handleMouseMove = (e: MouseEvent) => {
			mouseX.set(e.clientX);
			mouseY.set(e.clientY);
			if (!isVisible) setIsVisible(true);
		};

		const handleMouseLeave = () => setIsVisible(false);
		const handleMouseEnter = () => setIsVisible(true);

		window.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseleave", handleMouseLeave);
		document.addEventListener("mouseenter", handleMouseEnter);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseleave", handleMouseLeave);
			document.removeEventListener("mouseenter", handleMouseEnter);
		};
	}, [mouseX, mouseY, isVisible]);

	return (
		<>
			{/* The Dot */}
			<motion.div
				className="fixed w-1 h-1 bg-white rounded-full pointer-events-none z-[100]"
				style={{
					x: mouseX,
					y: mouseY,
					left: -2,
					top: -2,
					opacity: isVisible ? 1 : 0,
				}}
			/>
			{/* The Aura */}
			<motion.div
				className="fixed w-8 h-8 rounded-full pointer-events-none z-[99] backdrop-blur-[1px]"
				style={{
					x: auraX,
					y: auraY,
					left: -16,
					top: -16,
					backgroundColor: "rgba(168, 192, 255, 0.2)",
					opacity: isVisible ? 1 : 0,
				}}
			/>
		</>
	);
}
