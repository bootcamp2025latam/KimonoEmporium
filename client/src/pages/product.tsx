import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ShoppingCart from "@/components/shopping-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { Heart, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react";

export default function Product() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();

  const { data: product, isLoading, error } = useQuery<any>({
    queryKey: ['/api/products', id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <ShoppingCart />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
              <p className="text-muted-foreground mb-4">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
        <ShoppingCart />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }
    addToCart(product.id, selectedSize, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted/30">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="product-title">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary" data-testid="product-price">
                  ${product.price}
                </span>
                <Badge variant="secondary" className="text-sm">
                  {product.inStock > 0 ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground" data-testid="product-description">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <label className="text-base font-medium">Size</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full" data-testid="size-select">
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes?.map((size: string) => (
                    <SelectItem key={size} value={size} data-testid={`size-option-${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-base font-medium">Quantity</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="quantity-decrease"
                >
                  -
                </Button>
                <span className="text-lg font-medium w-8 text-center" data-testid="quantity-value">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  data-testid="quantity-increase"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedSize || product.inStock <= 0}
                data-testid="add-to-cart-btn"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart - ${product.price}
              </Button>
              
              <Button variant="outline" className="w-full" size="lg" data-testid="add-to-favorites-btn">
                <Heart className="w-5 h-5 mr-2" />
                Add to Favorites
              </Button>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders $75+</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30 day policy</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">Encrypted checkout</p>
              </div>
            </div>

            {/* Size Guide */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Size Guide</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>XS:</strong> Chest 32-34", Length 48"</p>
                  <p><strong>S:</strong> Chest 36-38", Length 50"</p>
                  <p><strong>M:</strong> Chest 40-42", Length 52"</p>
                  <p><strong>L:</strong> Chest 44-46", Length 54"</p>
                  <p><strong>XL:</strong> Chest 48-50", Length 56"</p>
                  <p><strong>2XL:</strong> Chest 52-54", Length 58"</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <ShoppingCart />
    </div>
  );
}
