"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ locale }: { locale: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();
	const isRtl = locale === "fa";

	// 3. Body scroll lock
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleLanguage = () => {
		const segments = pathname.split("/");
		const currentLocale = segments[1];
		const newLocale = currentLocale === "en" ? "fa" : "en";
		segments[1] = newLocale;
		window.location.href = segments.join("/");
	};

	const handleScroll = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
	) => {
		if (pathname === `/${locale}` || pathname === `/${locale}/`) {
			const href = e.currentTarget.getAttribute("href");
			if (href?.includes("#projects")) {
				e.preventDefault();
				document
					.getElementById("projects")
					?.scrollIntoView({ behavior: "smooth" });
				setIsOpen(false);
			}
		}
	};

	const navLinks = [
		{
			href: `/${locale}/#projects`,
			label: isRtl ? "پروژه‌ها" : "Projects",
		},
		{ href: `/${locale}/about`, label: isRtl ? "درباره ما" : "About" },
		{ href: `/${locale}/contact`, label: isRtl ? "تماس" : "Contact" },
	];

	const menuVariants = {
		hidden: { x: "100%", opacity: 0 },
		visible: {
			x: 0,
			opacity: 1,
			transition: { type: "spring" as const, stiffness: 300, damping: 30 },
		},
		exit: {
			x: "100%",
			opacity: 0,
			transition: { duration: 0.25, ease: "easeIn" as const },
		},
	};

	const itemVariants = {
		hidden: { x: 40, opacity: 0 },
		visible: (i: number) => ({
			x: 0,
			opacity: 1,
			transition: { delay: i * 0.07 + 0.1, duration: 0.35, ease: "easeOut" as const },
		}),
	};

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-300">
				{/* Background Layers */}
				<div className="absolute inset-0 z-0 pointer-events-none">
					{/* Always-on solid black base — ensures mobile is never transparent */}
					<div className="absolute inset-0 bg-black" />

					{/* Desktop: gradient on top of black (from black/80 → transparent looks identical over black) */}
					<div className="absolute inset-0 bg-linear-to-b from-black/80 to-transparent hidden md:block" />

					{/* Desktop: re-solidify with blur on scroll */}
					<div
						className={`absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500 ease-in-out hidden md:block ${
							isScrolled ? "opacity-100" : "opacity-0"
						}`}
					/>
				</div>

				<div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-between">
					{/* Logo Container */}
					<Link
						href={`/${locale}`}
						className="flex items-center gap-3 hover:opacity-80 transition-opacity"
					>
						<Image
							src="/logo-icon-white.png"
							width={50}
							height={50}
							alt="Little Black Fish"
							className="w-10 h-auto md:w-12"
						/>
						<span className="font-lalezar text-xl md:text-2xl text-white tracking-wide">
							{isRtl
								? "استودیو ماهی سیاه کوچولو"
								: "Little Black Fish"}
						</span>
					</Link>

					{/* Desktop Links */}
					<div className="hidden md:flex items-center gap-10">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={
									link.href.includes("#projects")
										? handleScroll
										: undefined
								}
								className={`font-black uppercase transition-colors ${
									isRtl
										? "text-lg tracking-normal"
										: "text-xs tracking-[0.3em] text-white/70 hover:text-white"
								}`}
							>
								{link.label}
							</Link>
						))}

						<button
							onClick={toggleLanguage}
							className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
						>
							<Globe size={14} />
							{locale === "en" ? "FA" : "EN"}
						</button>
					</div>

					{/* Mobile Toggle Button */}
					<button
						className="md:hidden text-white p-2"
						onClick={() => setIsOpen(true)}
						aria-label="Open menu"
					>
						<Menu size={28} />
					</button>
				</div>
			</header>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm md:hidden"
							onClick={() => setIsOpen(false)}
						/>

						{/* Slide-in panel */}
						<motion.div
							variants={menuVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className={`fixed top-0 h-dvh w-full max-w-sm z-[9999] bg-zinc-950 flex flex-col md:hidden border-zinc-800 ${
								isRtl ? "left-0 border-r" : "right-0 border-l"
							}`}
						>
							{/* Top bar: logo + close */}
							<div className={`flex items-center justify-between px-6 h-24 border-b border-zinc-800/60 ${isRtl ? "flex-row-reverse" : ""}`}>
								<Link
									href={`/${locale}`}
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-3"
								>
									<Image
										src="/logo-icon-white.png"
										width={36}
										height={36}
										alt="Logo"
										className="w-8 h-auto"
									/>
									<span className="font-lalezar text-lg text-white">
										{isRtl ? "ماهی سیاه" : "Little Black Fish"}
									</span>
								</Link>
								<motion.button
									onClick={() => setIsOpen(false)}
									whileTap={{ scale: 0.9 }}
									className="p-2 text-white/60 hover:text-white transition-colors"
									aria-label="Close menu"
								>
									<X size={24} />
								</motion.button>
							</div>

							{/* Nav links */}
							<nav className="flex flex-col px-6 pt-6 gap-1 flex-1">
								{navLinks.map((link, i) => (
									<motion.div
										key={link.href}
										custom={i}
										variants={itemVariants}
										initial="hidden"
										animate="visible"
									>
										<Link
											href={link.href}
											onClick={
												link.href.includes("#projects")
													? (e) => {
															handleScroll(e);
															setIsOpen(false);
														}
													: () => setIsOpen(false)
											}
											className={`group flex items-center gap-4 py-5 border-b border-zinc-800/40 ${
												isRtl ? "flex-row-reverse text-right" : ""
											}`}
										>
											<span className="text-blue-500 text-xs font-black tracking-widest w-5 text-center shrink-0">
												{String(i + 1).padStart(2, "0")}
											</span>
											<span
												className={`font-black uppercase text-white group-hover:text-blue-400 transition-colors flex-1 ${
													isRtl
														? "text-2xl tracking-normal"
														: "text-xl tracking-[0.15em]"
												}`}
											>
												{link.label}
											</span>
											<ChevronRight
												size={16}
												className={`shrink-0 text-zinc-600 group-hover:text-blue-500 transition-all ${
													isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"
												}`}
											/>
										</Link>
									</motion.div>
								))}
							</nav>

							{/* Bottom: language toggle */}
							<motion.div
								custom={navLinks.length}
								variants={itemVariants}
								initial="hidden"
								animate="visible"
								className="px-6 pb-8 pt-4 border-t border-zinc-800/60"
							>
								<button
									onClick={() => {
										toggleLanguage();
										setIsOpen(false);
									}}
									className="w-full flex items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
								>
									<Globe size={16} />
									{locale === "en" ? "Persian (FA)" : "English (EN)"}
								</button>
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
