import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { VoicesSection } from "@/components/landing/voices-section";
import { DataSection } from "@/components/landing/data-section";
import { SolutionsSection } from "@/components/landing/solutions-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden font-(--font-sarabun)">
      <Hero />
      <ProblemSection />
      <VoicesSection />
      <DataSection />
      <SolutionsSection />
      <Footer />
    </main>
  );
}
