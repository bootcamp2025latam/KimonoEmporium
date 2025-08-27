import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link href="/" className="text-2xl font-bold mb-4 inline-block" data-testid="footer-logo">
              <span className="text-primary">Wu</span>
              <span className="text-secondary">Wei</span>
            </Link>
            <p className="text-background/80 mb-4 max-w-md" data-testid="footer-description">
              Celebrating neurodiversity through comfortable, stylish kimonos that let you 
              express your authentic self.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-background/80 hover:text-background transition-colors"
                data-testid="social-instagram"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a 
                href="#" 
                className="text-background/80 hover:text-background transition-colors"
                data-testid="social-tiktok"
              >
                <i className="fab fa-tiktok text-xl"></i>
              </a>
              <a 
                href="#" 
                className="text-background/80 hover:text-background transition-colors"
                data-testid="social-twitter"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4" data-testid="footer-shop-title">Shop</h3>
            <ul className="space-y-2 text-background/80">
              <li>
                <Link href="/" className="hover:text-background transition-colors" data-testid="footer-all-kimonos">
                  All Kimonos
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-background transition-colors" data-testid="footer-new-arrivals">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#size-guide" className="hover:text-background transition-colors" data-testid="footer-size-guide">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="#care" className="hover:text-background transition-colors" data-testid="footer-care">
                  Care Instructions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4" data-testid="footer-support-title">Support</h3>
            <ul className="space-y-2 text-background/80">
              <li>
                <Link href="#contact" className="hover:text-background transition-colors" data-testid="footer-contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#shipping" className="hover:text-background transition-colors" data-testid="footer-shipping">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-background transition-colors" data-testid="footer-faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#accessibility" className="hover:text-background transition-colors" data-testid="footer-accessibility">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/80">
          <p data-testid="footer-copyright">
            &copy; 2024 WuWei. All rights reserved. | Made with ❤️ for the neurodivergent community
          </p>
        </div>
      </div>
    </footer>
  );
}
