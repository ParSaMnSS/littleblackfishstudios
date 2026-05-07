"use client";

import dynamic from "next/dynamic";
import type { HeroProps } from "./types";

const HeroClient = dynamic(() => import("./HeroClient"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full mt-24 md:mt-0 h-[80vh] md:h-screen bg-black" />
  ),
});

export default function Hero(props: HeroProps) {
  return <HeroClient {...props} />;
}
