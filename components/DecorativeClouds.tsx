"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import FloatingElement from "@/components/FloatingElement";

export default function DecorativeClouds({
	animated = true,
}: {
	animated?: boolean;
}) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
			{/* Cloud A */}
			<FloatingElement
				duration={25}
				delay={0}
				yOffset={animated ? 15 : 0}
				xOffset={animated ? -80 : 0}
				className="cloud-tr absolute right-[-5%] top-[12%]
					w-44 opacity-75
					sm:right-0 sm:top-[8%] sm:w-52 sm:opacity-80
					md:w-64
					lg:top-0 lg:right-0 lg:w-140 lg:opacity-90"
			>
				<Image
					loading="eager"
					src="/Cloud.svg"
					alt=""
					width={420}
					height={210}
					className="h-auto w-full opacity-60"
				/>
			</FloatingElement>

			{/* Cloud B */}
			<FloatingElement
				duration={30}
				delay={2}
				yOffset={animated ? 20 : 0}
				xOffset={animated ? 120 : 0}
				className="absolute
					top-[48%] left-[-18%] w-52 opacity-55
					sm:top-[45%] sm:left-[-16%] sm:w-64 sm:opacity-55
					md:w-80 md:opacity-55
					lg:top-auto lg:bottom-[-10%] lg:left-[-10%] lg:w-180 lg:opacity-60"
			>
				<Image
					loading="eager"
					src="/Cloud.svg"
					alt=""
					width={520}
					height={260}
					className="h-auto w-full"
				/>
			</FloatingElement>

			{/* Cloud C*/}
			<FloatingElement
				duration={20}
				delay={1}
				yOffset={animated ? 12 : 0}
				xOffset={animated ? -60 : 0}
				className="absolute
					bottom-[14%] right-[-8%] w-44 opacity-70
					sm:bottom-[10%] sm:right-[-6%] sm:w-56 sm:opacity-75
					md:w-72
					lg:bottom-[-10%] lg:right-[-10%] lg:w-140 lg:opacity-90"
			>
				<Image
					src="/Cloud.svg"
					alt=""
					width={270}
					height={135}
					className="h-auto w-full opacity-60"
				/>
			</FloatingElement>
		</div>
	);
}
