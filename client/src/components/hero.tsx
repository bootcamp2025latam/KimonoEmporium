import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="inline-flex items-center mb-6">
              <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium">New Collection Available</span>
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="hero-title">
              Celebrate Your{" "}
              <span className="text-primary">Neuro</span>
              <span className="text-secondary">diversity</span>
              <br />
              in Style
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0" data-testid="hero-description">
              Comfort meets self-expression in our collection of kimonos designed for 
              the beautifully unique neurodivergent community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground px-8 py-3 font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                data-testid="shop-collection-btn"
              >
                Shop Collection
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3 font-semibold hover:bg-muted transition-colors"
                data-testid="learn-story-btn"
              >
                Learn Our Story
              </Button>
            </div>
          </div>

          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-secondary/20 rounded-full animate-float"></div>
            <div className="absolute top-1/2 -right-6 w-12 h-12 bg-accent/20 rounded-full animate-bounce-gentle"></div>
            <div 
              className="absolute -bottom-6 left-1/3 w-8 h-8 bg-primary/20 rounded-full animate-float" 
              style={{ animationDelay: '1s' }}
            ></div>

            {/* Featured kimono image */}
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
              alt="Featured WuWei kimono with vibrant neurodiversity design"
              className="rounded-2xl shadow-2xl w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-300"
              data-testid="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
