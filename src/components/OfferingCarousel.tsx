"use client";

import Image from "next/image";
import Link from "next/link";
import { offerings } from "@/lib/site-data";
import Carousel from "./Carousel";

export default function OfferingCarousel() {
  return (
    <Carousel>
      {offerings.map((o) => (
        <Link
          key={o.title}
          href={o.href}
          className="group flex flex-col flex-[0_0_min(100%,17.5rem)] sm:flex-[0_0_20rem] lg:flex-[0_0_21rem] bg-surface-container-lowest rounded-2xl overflow-hidden ak-card ring-1 ring-black/5 hover:ring-primary/30"
        >
          <div className="overflow-hidden aspect-[4/3]">
            <Image
              src={o.img}
              alt=""
              width={400}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-headline text-lg text-primary mb-2">{o.title}</h3>
            <p className="text-sm text-on-surface-variant flex-1">{o.blurb}</p>
            <span className="mt-4 text-sm font-bold text-secondary group-hover:text-primary transition-colors">
              Learn more →
            </span>
          </div>
        </Link>
      ))}
    </Carousel>
  );
}
