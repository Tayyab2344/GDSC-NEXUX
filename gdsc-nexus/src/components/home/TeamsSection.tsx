import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Smartphone, Brain, Gamepad2, Users, Megaphone, Palette, Shield } from "lucide-react";

const teams = [
  {
    name: "Web Development",
    description: "Build modern, responsive web applications using React, Next.js, and cutting-edge frameworks.",
    icon: Globe,
    color: "google-blue",
    members: 45,
    lead: "Alex Chen",
  },
  {
    name: "Mobile Development",
    description: "Create native and cross-platform mobile apps with Flutter, React Native, and Swift.",
    icon: Smartphone,
    color: "google-green",
    members: 38,
    lead: "Sarah Kim",
  },
  {
    name: "AI & Machine Learning",
    description: "Explore deep learning, NLP, and computer vision with Python and TensorFlow.",
    icon: Brain,
    color: "google-red",
    members: 52,
    lead: "Mike Johnson",
  },
  {
    name: "Game Development",
    description: "Design and develop immersive games using Unity, Unreal Engine, and Godot.",
    icon: Gamepad2,
    color: "google-yellow",
    members: 28,
    lead: "Emma Davis",
  },
  {
    name: "Core Team",
    description: "Drive technical initiatives, mentor members, and shape the community's direction.",
    icon: Shield,
    color: "google-blue",
    members: 12,
    lead: "James Wilson",
  },
  {
    name: "Design & UX",
    description: "Craft beautiful user experiences with Figma, prototyping, and design systems.",
    icon: Palette,
    color: "google-green",
    members: 24,
    lead: "Lisa Park",
  },
  {
    name: "Community",
    description: "Organize events, workshops, and foster connections within our developer community.",
    icon: Users,
    color: "google-red",
    members: 18,
    lead: "Ryan Lee",
  },
  {
    name: "Marketing",
    description: "Spread the word through content creation, social media, and campus outreach.",
    icon: Megaphone,
    color: "google-yellow",
    members: 15,
    lead: "Anna Brown",
  },
];

const colorClasses: Record<string, string> = {
  "google-blue": "bg-google-blue/10 text-google-blue border-google-blue/20 group-hover:bg-google-blue group-hover:text-primary-foreground",
  "google-green": "bg-google-green/10 text-google-green border-google-green/20 group-hover:bg-google-green group-hover:text-primary-foreground",
  "google-red": "bg-google-red/10 text-google-red border-google-red/20 group-hover:bg-google-red group-hover:text-primary-foreground",
  "google-yellow": "bg-google-yellow/10 text-google-yellow border-google-yellow/20 group-hover:bg-google-yellow group-hover:text-foreground",
};

const TeamsSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Teams
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Find Your <span className="text-google-blue">Passion</span>
          </h2>
          <p className="text-muted-foreground">
            Join specialized teams led by experienced developers. Learn from peers,
            contribute to projects, and grow your skills in your area of interest.
          </p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teams.map((team, index) => (
            <div
              key={team.name}
              className="group bg-card rounded-2xl p-6 border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${colorClasses[team.color]} flex items-center justify-center mb-4 transition-colors duration-300 border`}>
                <team.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{team.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{team.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">{team.members}</span> members
                </span>
                <span className="text-primary font-medium group-hover:underline">
                  View team
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="group">
            Explore All Teams
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TeamsSection;
