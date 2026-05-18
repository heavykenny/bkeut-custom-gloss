import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { SocialStrip } from "../components/layout/SocialStrip";
import { ProductTile } from "../components/shop/ProductTile";
import { PRODUCTS } from "../data/products";
import { STAGGER } from "../lib/motion";
import tubeImage from "../assets/lipgloss-tube.png";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "BKEUT&Co. — Our range" },
      { name: "description", content: "Bespoke gift customization by BKEUT&Co. Lipgloss live now, more coming soon." },
    ],
  }),
});

function ShopPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav onOpenBag={() => { window.location.href = "/"; }} />
      <SocialStrip />
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-12">Our range</h1>
        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {PRODUCTS.map((p) => (
            <ProductTile key={p.id} product={p} preview={p.id === "lipgloss" ? tubeImage : undefined} />
          ))}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
