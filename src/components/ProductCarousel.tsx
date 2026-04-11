"use client";

import { products } from "@/lib/site-data";
import ProductCard from "./ProductCard";
import Carousel from "./Carousel";

export default function ProductCarousel() {
  return (
    <Carousel>
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} variant="carousel" />
      ))}
    </Carousel>
  );
}
