"use client";

import dynamic from "next/dynamic";
import type { HeroProps } from "./types";

const HeroClient = dynamic(() => import("./HeroClient"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full mt-20 md:mt-0 h-[88svh] md:h-screen bg-black" />
  ),
});

export default function Hero(props: HeroProps) {
  return <HeroClient {...props} />;
}
