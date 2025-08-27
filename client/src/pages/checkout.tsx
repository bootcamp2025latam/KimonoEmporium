import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Lock, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { createPaymentLink } from "@/lib/stripe";

const CheckoutForm = () => {
  const { toast } = useToast();
  const { items, total, subtotal, tax, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  const handleCreatePaymentLink = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // For 4Geeks, we need to create a product first, then a payment link
      // For now, we'll use a dummy product ID - in production this should be dynamic
      const result = await createPaymentLink('dummy-product-id', email, items);
      
      setPaymentLink(result.paymentLink);
      
      toast({
        title: "Payment Link Created",
        description: "Click the button below to complete your payment.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create payment link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    // This would typically be called via webhook or redirect
    clearCart();
    toast({
      title: "Payment Successful!",
      description: "Thank you for your purchase!",
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-6">
                Add some beautiful WuWei kimonos to your cart before checking out.
              </p>
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="checkout-form">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4" data-testid={`order-item-${item.id}`}>
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{item.product.name}</h3>
                <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                <p className="text-sm">Qty: {item.quantity} × ${item.product.price}</p>
              </div>
              <span className="font-semibold" data-testid={`item-total-${item.id}`}>
                ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span data-testid="subtotal">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span data-testid="tax">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span className="text-accent">FREE</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span data-testid="total">${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              data-testid="email-input"
            />
          </div>

          {!paymentLink ? (
            <Button
              onClick={handleCreatePaymentLink}
              className="w-full"
              size="lg"
              disabled={isProcessing || !email}
              data-testid="create-payment-link-btn"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                  Creating Payment Link...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Create Payment Link - ${total.toFixed(2)}
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Your secure payment link is ready!
                </p>
                <Button
                  asChild
                  className="w-full"
                  size="lg"
                  data-testid="pay-now-btn"
                >
                  <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Pay Now - ${total.toFixed(2)}
                  </a>
                </Button>
              </div>
              
              <Button
                onClick={handlePaymentSuccess}
                variant="outline"
                className="w-full"
                size="lg"
                data-testid="mark-paid-btn"
              >
                I've Completed Payment
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Secured by 4Geeks</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Checkout() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-6">
                Add some beautiful WuWei kimonos to your cart before checking out.
              </p>
              <Button asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" size="sm" asChild data-testid="back-to-shopping-btn">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shopping
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Secure Checkout</h1>
        </div>

        <CheckoutForm />
      </div>

      <Footer />
    </div>
  );
}
