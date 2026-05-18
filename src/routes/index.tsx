import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { z } from "zod";
import { CustomizerScreen } from "../components/customizer/CustomizerScreen";
import { ReviewScreen } from "../components/checkout/ReviewScreen";
import { MiniBagPanel } from "../components/checkout/MiniBagPanel";
import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { SocialStrip } from "../components/layout/SocialStrip";

const indexSearchSchema = z.object({
  screen: z.enum(["review"]).optional(),
});

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: indexSearchSchema,
  head: () => ({
    meta: [
      { title: "BKEUT&Co. Lipgloss — Bespoke Labeled Gloss" },
      {
        name: "description",
        content:
          "Customizable luxury lip gloss by BKEUT&Co. Personalize your shade and labeling for birthdays, weddings, quotes, and every indulgent moment.",
      },
      { property: "og:title", content: "BKEUT&Co. Lipgloss — Bespoke Labeled Gloss" },
      { property: "og:description", content: "Bespoke lip gloss, labeled and poured for you." },
    ],
  }),
});

function Index() {
  const { screen } = Route.useSearch();
  const [bagOpen, setBagOpen] = useState(false);
  const onReview = screen === "review";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav onOpenBag={() => setBagOpen(true)} />
      <SocialStrip visible={!onReview} />
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {onReview ? (
            <ReviewScreen key="review" />
          ) : (
            <CustomizerScreen key="customize" onAdded={() => setBagOpen(true)} />
          )}
        </AnimatePresence>
      </LayoutGroup>
      <MiniBagPanel open={bagOpen} onClose={() => setBagOpen(false)} />
      <Footer />
    </div>
  );
}
