import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const stats = [
    { icon: Users, value: "500+", label: "Active Members" },
    { icon: Calendar, value: "50+", label: "Events Hosted" },
    { icon: Award, value: "8", label: "Expert Teams" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-google-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-google-green/10 rounded-full blur-3xl" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-google-yellow/5 rounded-full blur-3xl" />

      {/* Floating geometric shapes */}
      <div className="absolute top-32 left-[15%] w-4 h-4 bg-google-blue rounded-full animate-float opacity-60" />
      <div className="absolute top-48 right-[20%] w-6 h-6 bg-google-red rounded-lg rotate-45 animate-float opacity-60" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-32 left-[25%] w-5 h-5 bg-google-green rounded-full animate-float opacity-60" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-48 right-[15%] w-4 h-4 bg-google-yellow rounded-lg animate-float opacity-60" style={{ animationDelay: "0.5s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-google-green animate-pulse" />
            <span className="text-sm font-medium text-foreground">Now accepting new members for 2024</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Build. Learn.{" "}
            <span className="text-google-blue">Grow Together.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
            Join the premier student developer community. Master cutting-edge technologies,
            collaborate on real projects, and launch your tech career with us.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Link to="/signup">
              <Button variant="google" size="xl" className="group">
                Join the Community
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="gap-2">
              <Play className="w-5 h-5" />
              Watch Overview
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "400ms" }}>
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary mb-3 group-hover:shadow-md transition-shadow">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
