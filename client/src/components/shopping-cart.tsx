import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";

export default function ShoppingCart() {
  const { 
    items, 
    itemCount, 
    total, 
    subtotal, 
    tax, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeItem 
  } = useCart();

  // Handle escape key to close cart
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, setIsCartOpen]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50" data-testid="cart-overlay">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl transform transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="cart-sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold" data-testid="cart-title">
              Shopping Cart ({itemCount})
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartOpen(false)}
              data-testid="close-cart-btn"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-cart">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Add some beautiful WuWei kimonos to get started!
                </p>
                <Button onClick={() => setIsCartOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-4" data-testid={`cart-item-${item.id}`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm" data-testid={`item-name-${item.id}`}>
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground" data-testid={`item-size-${item.id}`}>
                          Size: {item.size}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-6 h-6 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              data-testid={`decrease-quantity-${item.id}`}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            
                            <span className="text-sm font-medium w-8 text-center" data-testid={`item-quantity-${item.id}`}>
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-6 h-6 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              data-testid={`increase-quantity-${item.id}`}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm" data-testid={`item-total-${item.id}`}>
                              ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive p-1"
                              onClick={() => removeItem(item.id)}
                              data-testid={`remove-item-${item.id}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span data-testid="cart-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span data-testid="cart-tax">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span className="text-accent">FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span data-testid="cart-total">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                asChild
                data-testid="checkout-btn"
              >
                <Link href="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => setIsCartOpen(false)}
                data-testid="continue-shopping-btn"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
