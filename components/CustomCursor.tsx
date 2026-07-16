"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	size: number;
	rotation: number;
	rotSpeed: number;
}

export default function CustomCursor() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const mouseX = useMotionValue(-100);
	const mouseY = useMotionValue(-100);

	useEffect(() => {
		// Only show on devices with a mouse
		if (window.matchMedia("(pointer: coarse)").matches) {
			return;
		}

		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const particles: Particle[] = [];
		let animationFrameId: number;

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		window.addEventListener("resize", resize);
		resize();

		const drawStar = (
			cx: number,
			cy: number,
			spikes: number,
			outerRadius: number,
			innerRadius: number,
			color: string,
			rotation: number,
		) => {
			let rot = (Math.PI / 2) * 3 + rotation;
			let x = cx;
			let y = cy;
			const step = Math.PI / spikes;

			ctx.beginPath();
			ctx.moveTo(
				cx + Math.cos(rot) * outerRadius,
				cy + Math.sin(rot) * outerRadius,
			);
			for (let i = 0; i < spikes; i++) {
				x = cx + Math.cos(rot) * outerRadius;
				y = cy + Math.sin(rot) * outerRadius;
				ctx.lineTo(x, y);
				rot += step;

				x = cx + Math.cos(rot) * innerRadius;
				y = cy + Math.sin(rot) * innerRadius;
				ctx.lineTo(x, y);
				rot += step;
			}
			ctx.lineTo(
				cx + Math.cos(rot) * outerRadius,
				cy + Math.sin(rot) * outerRadius,
			);
			ctx.closePath();
			ctx.fillStyle = color;
			ctx.fill();
		};

		const updateAndDrawParticles = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw particles
			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i];
				p.x += p.vx;
				p.y += p.vy;
				p.rotation += p.rotSpeed;
				p.life -= 0.02; // fade out speed

				if (p.life <= 0) {
					particles.splice(i, 1);
					continue;
				}

				// Gold color: #fbbf24 = 251, 191, 36
				const color = `rgba(251, 191, 36, ${p.life})`;
				drawStar(
					p.x,
					p.y,
					4,
					p.size * p.life,
					(p.size * p.life) / 3,
					color,
					p.rotation,
				);
			}

			animationFrameId = requestAnimationFrame(updateAndDrawParticles);
		};
		updateAndDrawParticles();

		let lastPos = { x: -100, y: -100 };

		const handleMouseMove = (e: MouseEvent) => {
			const x = e.clientX;
			const y = e.clientY;

			mouseX.set(x);
			mouseY.set(y);

			if (!isVisible) setIsVisible(true);

			// Distance check to spawn particles
			const dx = x - lastPos.x;
			const dy = y - lastPos.y;
			const dist = Math.sqrt(dx * dx + dy * dy);

			if (dist > 4) {
				// Spawn 1 or 2 particles randomly when moving
				const spawnCount = Math.random() > 0.5 ? 1 : 2;
				for (let i = 0; i < spawnCount; i++) {
					particles.push({
						x: x,
						y: y + 10, // slight offset from center
						vx: (Math.random() - 0.5) * 1.5,
						vy: Math.random() * 1 + 0.5, // fall downwards slightly
						life: 1,
						size: Math.random() * 6 + 4, // radius
						rotation: Math.random() * Math.PI,
						rotSpeed: (Math.random() - 0.5) * 0.1,
					});
				}
				lastPos = { x, y };
			}
		};

		const handleMouseLeave = () => setIsVisible(false);
		const handleMouseEnter = () => setIsVisible(true);

		window.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseleave", handleMouseLeave);
		document.addEventListener("mouseenter", handleMouseEnter);

		return () => {
			window.removeEventListener("resize", resize);
			window.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseleave", handleMouseLeave);
			document.removeEventListener("mouseenter", handleMouseEnter);
			cancelAnimationFrame(animationFrameId);
		};
	}, [isVisible, mouseX, mouseY]);

	return (
		<>
			{/* Fairy dust canvas */}
			<canvas
				ref={canvasRef}
				className="fixed inset-0 pointer-events-none z-90"
				style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s" }}
			/>

			{/* Main Cursor: Gold Diamond/Star */}
			<motion.div
				className="fixed w-8 h-8 pointer-events-none z-100 flex items-center justify-center text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
				style={{
					x: mouseX,
					y: mouseY,
					left: -16,
					top: -16,
					opacity: isVisible ? 1 : 0,
				}}
			>
				{/* Shadow circle / Aura */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-yellow-400/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(251,191,36,0.2)]" />

				<svg
					className="relative z-10"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
						fill="currentColor"
					/>
				</svg>
			</motion.div>
		</>
	);
}
