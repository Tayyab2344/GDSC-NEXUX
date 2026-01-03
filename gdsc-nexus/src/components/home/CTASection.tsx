import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config/api";

interface MembershipDriveConfig {
  active: boolean;
  buttonText: string;
}

const CTASection = () => {
  const { data: membershipConfig } = useQuery({
    queryKey: ["config", "membership_drive"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/config/membership_drive`);
        if (!res.ok) return null;
        const data = await res.json();
        return data?.value as MembershipDriveConfig | null;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const isDriveActive = membershipConfig?.active ?? false;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-google-blue/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-google-blue/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-google-green/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-google-blue mb-8 shadow-md">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Start Your{" "}
            <span className="text-google-blue">Developer Journey?</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join hundreds of students who are learning, building, and growing together.
            Your next big project starts here.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isDriveActive ? (
              <Link to="/signup">
                <Button variant="google" size="xl" className="group">
                  {membershipConfig?.buttonText || "Become a Member"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Link to="/events">
                <Button variant="google" size="xl" className="group">
                  Explore Events
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
            <Link to="/contact">
              <Button variant="outline" size="xl">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-google-green" />
              Free to join
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-google-blue" />
              No experience required
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-google-yellow" />
              Instant access
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
