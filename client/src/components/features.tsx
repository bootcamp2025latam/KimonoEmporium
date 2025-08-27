import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, Truck } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Leaf,
      title: "Sensory-Friendly Fabrics",
      description: "Soft, breathable materials that feel amazing against your skin, without scratchy tags or uncomfortable seams.",
      color: "bg-primary/10 group-hover:bg-primary/20 text-primary",
    },
    {
      icon: Heart,
      title: "Inclusive Sizing",
      description: "Available in sizes XS-5XL with adjustable fits to accommodate all body types and comfort preferences.",
      color: "bg-secondary/10 group-hover:bg-secondary/20 text-secondary",
    },
    {
      icon: Truck,
      title: "Fast, Secure Shipping",
      description: "Free shipping on orders over $75, with discrete packaging and reliable tracking for peace of mind.",
      color: "bg-accent/10 group-hover:bg-accent/20 text-accent",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-muted/50 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="features-title">
            Why Choose WuWei?
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="features-description">
            Designed with neurodivergent comfort and style in mind
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center group">
                <Card className="bg-card shadow-sm group-hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${feature.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3" data-testid={`feature-title-${index}`}>
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
