import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { Heart } from "lucide-react";

export default function FeaturedProducts() {
  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/products/featured'],
  });
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 'M', 1); // Default to Medium size
    setIsCartOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="featured-title">
            Featured Kimonos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="featured-description">
            Each design celebrates the beautiful complexity of neurodivergent minds
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product: any) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="group bg-muted/30 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="aspect-square mb-4 rounded-xl overflow-hidden relative bg-gradient-to-br from-primary/20 to-accent/20">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    data-testid={`product-image-${product.id}`}
                  />
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-card/80 backdrop-blur-sm p-2 rounded-full hover:bg-card transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      data-testid={`favorite-btn-${product.id}`}
                    >
                      <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg" data-testid={`product-name-${product.id}`}>
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2" data-testid={`product-description-${product.id}`}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary" data-testid={`product-price-${product.id}`}>
                      ${product.price}
                    </span>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors text-sm font-medium"
                      onClick={(e) => handleAddToCart(product.id, e)}
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="secondary"
            size="lg"
            className="px-8 py-3 font-semibold hover:bg-secondary/90 transition-colors shadow-lg"
            data-testid="view-all-btn"
          >
            View All Kimonos
          </Button>
        </div>
      </div>
    </section>
  );
}
