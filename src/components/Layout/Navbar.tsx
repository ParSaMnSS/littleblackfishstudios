"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
	type Variants,
} from "framer-motion";

export default function Navbar({ locale }: { locale: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const isRtl = locale === "fa";

	const { scrollY } = useScroll();
	const headerHeight = useTransform(scrollY, [0, 120], [96, 72]);
	const logoSize = useTransform(scrollY, [0, 120], [48, 36]);
	const blurOpacity = useTransform(scrollY, [0, 80], [0, 1]);

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

	const panelVariants: Variants = {
		hidden: { x: "100%" },
		visible: {
			x: 0,
			transition: {
				type: "spring",
				stiffness: 260,
				damping: 28,
				when: "beforeChildren",
				staggerChildren: 0.07,
				delayChildren: 0.1,
			},
		},
		exit: {
			x: "100%",
			transition: { duration: 0.3, ease: "easeIn" },
		},
	};

	const itemVariants: Variants = {
		hidden: { x: 30, opacity: 0 },
		visible: {
			x: 0,
			opacity: 1,
			transition: { duration: 0.35, ease: "easeOut" },
		},
	};

	const topLineVariants: Variants = {
		closed: { rotate: 0, y: -6 },
		open: { rotate: 45, y: 0 },
	};
	const bottomLineVariants: Variants = {
		closed: { rotate: 0, y: 6 },
		open: { rotate: -45, y: 0 },
	};

	return (
		<>
			<motion.header
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				style={{ height: headerHeight }}
				className="fixed top-0 left-0 right-0 z-50"
			>
				<div className="absolute inset-0 z-0 pointer-events-none">
					<div className="absolute inset-0 bg-black md:bg-transparent" />
					<div className="absolute inset-0 bg-linear-to-b from-black/80 to-transparent hidden md:block" />
					<motion.div
						style={{ opacity: blurOpacity }}
						className="absolute inset-0 bg-black/90 backdrop-blur-md hidden md:block"
					/>
					<div className="absolute inset-0 bg-black md:hidden" />
				</div>

				<div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-between">
					<Link
						href={`/${locale}`}
						className="flex items-center gap-3 group"
					>
						<motion.div
							style={{ width: logoSize, height: logoSize }}
							className="relative shrink-0"
							whileHover={{ rotate: -8, scale: 1.05 }}
							transition={{ type: "spring", stiffness: 300, damping: 15 }}
						>
							<Image
								src="/logo-icon-white.png"
								fill
								sizes="48px"
								alt="Little Black Fish"
								className="object-contain"
							/>
						</motion.div>
						<span className="font-lalezar text-xl md:text-2xl text-white tracking-wide transition-opacity group-hover:opacity-80">
							{isRtl
								? "استودیو ماهی سیاه کوچولو"
								: "Little Black Fish"}
						</span>
					</Link>

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
								className={`relative group font-black uppercase ${
									isRtl
										? "text-lg tracking-normal text-white"
										: "text-xs tracking-[0.3em] text-white/70 hover:text-white transition-colors"
								}`}
							>
								<span>{link.label}</span>
								<motion.span
									className={`absolute -bottom-1 ${isRtl ? "right-0" : "left-0"} h-px w-full bg-blue-500 origin-left rtl:origin-right`}
									initial={{ scaleX: 0 }}
									whileHover={{ scaleX: 1 }}
									transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
									style={{ transformOrigin: isRtl ? "right" : "left" }}
								/>
							</Link>
						))}

						<motion.button
							onClick={toggleLanguage}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
							className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
						>
							<Globe size={14} />
							{locale === "en" ? "FA" : "EN"}
						</motion.button>
					</div>

					<motion.button
						className="md:hidden text-white p-2 relative w-10 h-10 flex items-center justify-center"
						onClick={() => setIsOpen((v) => !v)}
						aria-label={isOpen ? "Close menu" : "Open menu"}
						whileTap={{ scale: 0.9 }}
					>
						<motion.span
							className="absolute block h-[2px] w-7 bg-white rounded-full"
							variants={topLineVariants}
							animate={isOpen ? "open" : "closed"}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						/>
						<motion.span
							className="absolute block h-[2px] w-7 bg-white rounded-full"
							variants={bottomLineVariants}
							animate={isOpen ? "open" : "closed"}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						/>
					</motion.button>
				</div>
			</motion.header>

			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.25 }}
							className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm md:hidden"
							onClick={() => setIsOpen(false)}
						/>

						<motion.div
							variants={panelVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className={`fixed top-0 h-dvh w-full max-w-sm z-[9999] bg-zinc-950 flex flex-col md:hidden border-zinc-800 ${
								isRtl ? "left-0 border-r" : "right-0 border-l"
							}`}
						>
							<motion.div
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								exit={{ scaleX: 0 }}
								transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
								className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500 to-transparent origin-center"
							/>

							<div className={`flex items-center justify-between px-6 h-20 border-b border-zinc-800/60 ${isRtl ? "flex-row-reverse" : ""}`}>
								<motion.div variants={itemVariants}>
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
								</motion.div>
							</div>

							<nav className="flex flex-col px-6 pt-8 gap-1 flex-1">
								{navLinks.map((link, i) => (
									<motion.div
										key={link.href}
										variants={itemVariants}
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
											<motion.span
												className="text-zinc-600 group-hover:text-blue-500 transition-colors shrink-0"
												whileHover={{ x: isRtl ? -4 : 4 }}
											>
												{isRtl ? "←" : "→"}
											</motion.span>
										</Link>
									</motion.div>
								))}
							</nav>

							<motion.div
								variants={itemVariants}
								className="px-6 pb-8 pt-4 border-t border-zinc-800/60"
							>
								<motion.button
									onClick={() => {
										toggleLanguage();
										setIsOpen(false);
									}}
									whileTap={{ scale: 0.97 }}
									className="w-full flex items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
								>
									<Globe size={16} />
									{locale === "en" ? "Persian (FA)" : "English (EN)"}
								</motion.button>
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
