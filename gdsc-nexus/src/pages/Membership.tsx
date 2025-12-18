import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Users, BookOpen, Video, Award, MessageSquare } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started with basic access to our community.",
    color: "border-muted",
    features: [
      "Access to public events",
      "Community announcements",
      "Public gallery access",
      "General chat access",
      "Newsletter subscription"
    ],
    notIncluded: [
      "Workshop recordings",
      "Learning tracks",
      "Mentorship program",
      "Certificates",
      "Priority registration"
    ],
    cta: "Join Free",
    popular: false
  },
  {
    name: "Standard",
    price: "₹499",
    period: "per semester",
    description: "Perfect for active learners who want more.",
    color: "border-google-blue",
    features: [
      "Everything in Free",
      "All workshop recordings",
      "Basic learning tracks",
      "Team chat access",
      "Event certificates",
      "Priority event registration",
      "Member badge & ID card"
    ],
    notIncluded: [
      "1-on-1 mentorship",
      "Premium tracks",
      "Exclusive events"
    ],
    cta: "Get Standard",
    popular: true
  },
  {
    name: "Premium",
    price: "₹999",
    period: "per semester",
    description: "For serious developers seeking the best experience.",
    color: "border-google-yellow",
    features: [
      "Everything in Standard",
      "1-on-1 mentorship sessions",
      "Premium learning tracks",
      "Exclusive member events",
      "Project review sessions",
      "Career guidance",
      "LinkedIn recommendations",
      "Exclusive swag pack"
    ],
    notIncluded: [],
    cta: "Go Premium",
    popular: false
  }
];

const benefits = [
  {
    icon: BookOpen,
    title: "Learning Tracks",
    description: "Structured courses in Web, Mobile, AI/ML, and more."
  },
  {
    icon: Video,
    title: "Workshop Recordings",
    description: "Access all past workshop recordings anytime."
  },
  {
    icon: Users,
    title: "Mentorship",
    description: "Get guidance from experienced team leads."
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Earn certificates for completed tracks and events."
  },
  {
    icon: MessageSquare,
    title: "Private Channels",
    description: "Join team-specific chat channels and discussions."
  },
  {
    icon: Star,
    title: "Priority Access",
    description: "Early registration for limited-seat events."
  }
];

const Membership = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-20 px-4 bg-gradient-to-br from-google-blue/10 via-background to-google-yellow/10">
          <div className="container mx-auto text-center">
            <Badge className="mb-4 bg-google-blue/10 text-google-blue border-google-blue/20">
              <Crown className="h-3 w-3 mr-1" />
              Membership
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Unlock Your Full Potential
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our community and get access to exclusive resources, mentorship, 
              and opportunities to accelerate your developer journey.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative ${plan.color} ${plan.popular ? 'border-2 shadow-xl scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-google-blue text-white px-4 py-1">
                        <Zap className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="pt-4">
                      <span className="text-4xl font-display font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Button 
                      variant={plan.popular ? "google" : "outline"} 
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-google-green/20 flex items-center justify-center">
                            <Check className="h-3 w-3 text-google-green" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-center gap-3 opacity-50">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs">✕</span>
                          </div>
                          <span className="text-sm line-through">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">Member Benefits</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Everything you need to grow as a developer, all in one place.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-google-blue/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-google-blue" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-3xl font-display font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I upgrade my plan later?",
                  a: "Yes! You can upgrade anytime. The price difference will be prorated for the remaining semester."
                },
                {
                  q: "Is there a refund policy?",
                  a: "We offer a 7-day refund policy if you're not satisfied with your membership."
                },
                {
                  q: "Do I need to be a student to join?",
                  a: "While we primarily serve students, anyone interested in developer communities can join."
                },
                {
                  q: "How do I access the learning tracks?",
                  a: "Once you're a member, you'll get access to our learning portal with all available tracks."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-google-blue to-google-green text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">Ready to Join?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Start your journey with over 500+ members building amazing things together.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-google-blue hover:bg-white/90">
              Become a Member
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Membership;
