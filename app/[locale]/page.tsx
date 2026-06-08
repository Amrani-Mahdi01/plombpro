import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductShowcase } from "@/components/ProductShowcase";
import { PromoBanner } from "@/components/PromoBanner";
import { CategoryProducts } from "@/components/CategoryProducts";
import { BrandsMarquee } from "@/components/BrandsMarquee";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSlider />
        <CategoryGrid />
        <ProductShowcase />
        <PromoBanner />
        <CategoryProducts
          namespace="Heating"
          images={[
            "/products/promo-0.jpg",
            "/products/plumbing-2.jpg",
            "/products/promo-1.jpg",
            "/products/promo-4.jpg",
            "/products/plumbing-3.jpg",
            "/products/plumbing-5.jpg",
          ]}
          ids={["p18", "p19", "p20", "", "p21", "p22"]}
        />
        <CategoryProducts
          namespace="Knives"
          images={[
            "/products/knives-0.jpg",
            "/products/knives-1.jpg",
            "/products/knives-2.jpg",
            "/products/knives-3.jpg",
            "/products/knives-4.jpg",
            "/products/knives-5.jpg",
          ]}
          ids={["p4", "p5", "", "p26", "p6", ""]}
        />
        <BrandsMarquee />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
