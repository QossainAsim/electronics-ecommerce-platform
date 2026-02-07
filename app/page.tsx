import HeroSlider from "@/components/HeroSlider";
import CategoryMenuEnhanced from "@/components/CategoryMenuEnhanced";
import ProductsSection from "@/components/ProductsSection";
import IncentivesEnhanced from "@/components/IncentivesEnhanced";

export default function Home() {
  return (
    <>
      <HeroSlider />
     {/* ← This was missing from JSX! */}
      <ProductsSection />
      <IncentivesEnhanced />
    </>
  );
}