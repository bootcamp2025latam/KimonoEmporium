import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { Search, ShoppingBag, Menu } from "lucide-react";

export default function Navigation() {
  const { itemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4" data-testid="logo-link">
            <div className="text-2xl font-bold">
              <span className="text-primary">Wu</span>
              <span className="text-secondary">Wei</span>
              <span className="text-xs block text-muted-foreground -mt-1">
                Neurodiversity Fashion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-shop-all"
            >
              Shop All
            </Link>
            <Link 
              href="#about" 
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-about"
            >
              About Us
            </Link>
            <Link 
              href="#size-guide" 
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-size-guide"
            >
              Size Guide
            </Link>
            <Link 
              href="#contact" 
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-contact"
            >
              Contact
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-muted-foreground hover:text-foreground"
              data-testid="search-btn"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsCartOpen(true)}
              data-testid="cart-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-accent text-accent-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center"
                  data-testid="cart-count"
                >
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                  data-testid="mobile-menu-btn"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link 
                    href="/" 
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Shop All
                  </Link>
                  <Link 
                    href="#about" 
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    href="#size-guide" 
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Size Guide
                  </Link>
                  <Link 
                    href="#contact" 
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
