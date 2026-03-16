"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
	id: string;
	titleEn: string | null;
	titleFa: string | null;
	subtitleEn: string | null;
	subtitleFa: string | null;
	imageUrl: string | null;
	youtubeUrl: string | null;
}

interface HeroProps {
	slides: HeroSlide[];
	locale: string;
}

const Hero: React.FC<HeroProps> = ({ slides, locale }) => {
	const [current, setCurrent] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const isRtl = locale === "fa";

	const handleNext = useCallback(() => {
		setCurrent((prev) => (prev + 1) % slides.length);
	}, [slides.length]);

	const handlePrev = useCallback(() => {
		setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
	}, [slides.length]);

	// Auto-play logic with interaction pause
	useEffect(() => {
		if (slides.length <= 1 || isPaused) return;

		const timer = setInterval(() => {
			handleNext();
		}, 8000);

		return () => clearInterval(timer);
	}, [slides.length, isPaused, handleNext]);

	// Pause timer for 10 seconds on interaction
	const triggerInteraction = () => {
		setIsPaused(true);
		const resumeTimer = setTimeout(() => {
			setIsPaused(false);
		}, 10000);
		return () => clearTimeout(resumeTimer);
	};

	const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);
	const getYouTubeId = (url: string) => url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{11})/)?.[1];

	if (!slides || slides.length === 0) return null;

	const currentSlide = slides[current];
	const title = isRtl ? currentSlide.titleFa : currentSlide.titleEn;
	const subtitle = isRtl ? currentSlide.subtitleFa : currentSlide.subtitleEn;

	console.log("Current Hero Media URL:", currentSlide.youtubeUrl || currentSlide.imageUrl);

	return (
		<div className="relative h-screen w-full overflow-hidden bg-black">
			<AnimatePresence mode="wait">
				<motion.div
					key={currentSlide.id}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1.5, ease: "easeInOut" }}
					className="absolute inset-0"
				>
					{/* Background Media */}
					<motion.div
						initial={{ scale: 1.1 }}
						animate={{ scale: 1 }}
						transition={{ duration: 12, ease: "easeOut" }}
						className="absolute inset-0"
					>
						{currentSlide.youtubeUrl ? (
							<div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden">
								<iframe
									src={`https://www.youtube.com/embed/${getYouTubeId(currentSlide.youtubeUrl)}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&playlist=${getYouTubeId(currentSlide.youtubeUrl)}`}
									className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 object-cover"
									allow="autoplay; encrypted-media"
									frameBorder="0"
								/>
							</div>
						) : currentSlide.imageUrl && isVideo(currentSlide.imageUrl) ? (
							<video
								key={currentSlide.imageUrl} // Force re-render on slide change
								src={currentSlide.imageUrl}
								className="absolute inset-0 h-full w-full object-cover"
								autoPlay
								muted
								loop
								playsInline
								preload="auto"
							/>
						) : currentSlide.imageUrl ? (
							<Image
								src={currentSlide.imageUrl}
								alt={title || "Hero background"}
								fill
								priority
								className="object-cover"
							/>
						) : null}
					</motion.div>

					{/* Content Container */}
					{(title || subtitle) && (
						<div className="relative flex h-full items-center justify-center px-6 text-center">
							<div className="max-w-6xl">
								<motion.div
									initial={{ y: 40, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{
										delay: 0.5,
										duration: 1,
										ease: "easeOut",
									}}
									className="space-y-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
								>
									{title && (
										<>
											<h1
												className={`font-black tracking-tighter text-white uppercase leading-none
                        ${isRtl ? "text-5xl md:text-8xl" : "text-6xl md:text-9xl"}`}
											>
												{title}
											</h1>
											<div className="mx-auto h-1.5 w-32 bg-blue-600/90 shadow-xl" />
										</>
									)}

									{subtitle && (
										<p className="mx-auto max-w-2xl text-lg font-bold tracking-wide text-zinc-100 md:text-2xl">
											{subtitle}
										</p>
									)}
								</motion.div>
							</div>
						</div>
					)}
				</motion.div>
			</AnimatePresence>

			{/* Navigation Arrows */}
			{slides.length > 1 && (
				<>
					<button
						onClick={() => {
							triggerInteraction();
							handlePrev();
						}}
						className="absolute left-6 top-1/2 z-40 -translate-y-1/2 rounded-full p-4 text-white/40 transition-all hover:bg-black/20 hover:text-white drop-shadow-md"
						aria-label="Previous slide"
					>
						<ChevronLeft className="h-12 w-12" />
					</button>
					<button
						onClick={() => {
							triggerInteraction();
							handleNext();
						}}
						className="absolute right-6 top-1/2 z-40 -translate-y-1/2 rounded-full p-4 text-white/40 transition-all hover:bg-black/20 hover:text-white drop-shadow-md"
						aria-label="Next slide"
					>
						<ChevronRight className="h-12 w-12" />
					</button>
				</>
			)}

			{/* Slide Indicators */}
			{slides.length > 1 && (
				<div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-4 z-40">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => {
								triggerInteraction();
								setCurrent(index);
							}}
							className={`h-1 rounded-full transition-all duration-700 shadow-lg ${
								current === index
									? "w-16 bg-white"
									: "w-4 bg-white/20"
							}`}
						/>
					))}
				</div>
			)}

			{/* Scroll Decorator */}
			<div className="absolute bottom-10 left-10 hidden md:block z-40 drop-shadow-md">
				<div className="flex items-center gap-4 rotate-90 origin-left translate-y-24">
					<span className="text-[10px] font-black tracking-[0.5em] text-zinc-100 uppercase">
						Scroll to explore
					</span>
					<div className="h-px w-20 bg-zinc-100/50" />
				</div>
			</div>
		</div>
	);
};

export default Hero;
