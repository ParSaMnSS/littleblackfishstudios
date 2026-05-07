"use client";

import dynamic from "next/dynamic";
import type { HeroProps } from "./types";

const HeroClient = dynamic(() => import("./HeroClient"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full aspect-video md:aspect-auto md:h-screen bg-black" />
  ),
});

export default function Hero(props: HeroProps) {
  return <HeroClient {...props} />;
}
