import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import FeaturedProducts from "@/components/featured-products";
import Features from "@/components/features";
import Footer from "@/components/footer";
import ShoppingCart from "@/components/shopping-cart";

export default function Home() {
  return (
    <div className="min-h-screen bg-background memphis-pattern">
      <Navigation />
      <Hero />
      <FeaturedProducts />
      <Features />
      <Footer />
      <ShoppingCart />
    </div>
  );
}
