import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Code, Smartphone, Brain, Gamepad2, Clock, 
  Users, Star, Play, Lock, ChevronRight
} from "lucide-react";

const tracks = [
  {
    id: "web-fundamentals",
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, JavaScript, and modern web development practices from scratch.",
    icon: Code,
    color: "google-blue",
    level: "Beginner",
    duration: "20 hours",
    modules: 12,
    enrolled: 234,
    rating: 4.8,
    tags: ["HTML", "CSS", "JavaScript"],
    premium: false
  },
  {
    id: "react-mastery",
    title: "React Mastery",
    description: "Deep dive into React, hooks, state management, and building production-ready applications.",
    icon: Code,
    color: "google-blue",
    level: "Intermediate",
    duration: "30 hours",
    modules: 18,
    enrolled: 189,
    rating: 4.9,
    tags: ["React", "Redux", "TypeScript"],
    premium: false
  },
  {
    id: "mobile-flutter",
    title: "Mobile Development with Flutter",
    description: "Build beautiful cross-platform mobile apps with Flutter and Dart.",
    icon: Smartphone,
    color: "google-green",
    level: "Intermediate",
    duration: "25 hours",
    modules: 15,
    enrolled: 156,
    rating: 4.7,
    tags: ["Flutter", "Dart", "Firebase"],
    premium: false
  },
  {
    id: "ai-ml-intro",
    title: "Introduction to AI & Machine Learning",
    description: "Learn the fundamentals of AI, ML algorithms, and build your first models.",
    icon: Brain,
    color: "google-red",
    level: "Beginner",
    duration: "35 hours",
    modules: 20,
    enrolled: 278,
    rating: 4.8,
    tags: ["Python", "TensorFlow", "ML Basics"],
    premium: false
  },
  {
    id: "deep-learning",
    title: "Deep Learning & Neural Networks",
    description: "Advanced deep learning concepts, CNNs, RNNs, and transformer architectures.",
    icon: Brain,
    color: "google-red",
    level: "Advanced",
    duration: "40 hours",
    modules: 22,
    enrolled: 98,
    rating: 4.9,
    tags: ["PyTorch", "Neural Networks", "Computer Vision"],
    premium: true
  },
  {
    id: "game-unity",
    title: "Game Development with Unity",
    description: "Create 2D and 3D games using Unity game engine and C# programming.",
    icon: Gamepad2,
    color: "google-yellow",
    level: "Intermediate",
    duration: "45 hours",
    modules: 25,
    enrolled: 134,
    rating: 4.6,
    tags: ["Unity", "C#", "Game Design"],
    premium: true
  }
];

const LearningTracks = () => {
  const getColorClass = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      "google-blue": { bg: "bg-google-blue/10", text: "text-google-blue" },
      "google-green": { bg: "bg-google-green/10", text: "text-google-green" },
      "google-red": { bg: "bg-google-red/10", text: "text-google-red" },
      "google-yellow": { bg: "bg-google-yellow/10", text: "text-google-yellow" }
    };
    return colors[color] || colors["google-blue"];
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      "Beginner": "bg-google-green/10 text-google-green",
      "Intermediate": "bg-google-blue/10 text-google-blue",
      "Advanced": "bg-google-red/10 text-google-red"
    };
    return colors[level] || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-20 px-4 bg-gradient-to-br from-google-blue/10 via-background to-google-red/10">
          <div className="container mx-auto text-center">
            <Badge className="mb-4 bg-google-blue/10 text-google-blue border-google-blue/20">
              <BookOpen className="h-3 w-3 mr-1" />
              Learning Tracks
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Master New Skills
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Structured learning paths designed by industry experts to take you from 
              beginner to professional developer.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="google" size="lg">
                Browse All Tracks
              </Button>
              <Button variant="outline" size="lg">
                My Learning
              </Button>
            </div>
          </div>
        </section>

        {/* Tracks Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tracks.map((track) => {
                const colorClasses = getColorClass(track.color);
                return (
                  <Card key={track.id} className="group hover:shadow-xl transition-all relative overflow-hidden">
                    {track.premium && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-google-yellow to-google-red text-white">
                          <Lock className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-xl ${colorClasses.bg} flex items-center justify-center mb-4`}>
                        <track.icon className={`h-7 w-7 ${colorClasses.text}`} />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getLevelColor(track.level)}>{track.level}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-google-yellow text-google-yellow" />
                          {track.rating}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{track.title}</CardTitle>
                      <CardDescription>{track.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {track.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {track.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {track.modules} modules
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {track.enrolled}
                        </div>
                      </div>

                      <Button 
                        variant={track.premium ? "outline" : "google"} 
                        className="w-full group-hover:shadow-md transition-all"
                      >
                        {track.premium ? (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Unlock Track
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Start Learning
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Continue Learning */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <h2 className="text-2xl font-display font-bold mb-8">Continue Learning</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-google-blue/10">
                      <Code className="h-6 w-6 text-google-blue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">React Mastery</h3>
                      <p className="text-sm text-muted-foreground mb-3">Module 12: State Management with Redux</p>
                      <Progress value={65} className="h-2 mb-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">65% complete</span>
                        <Button variant="ghost" size="sm" className="text-google-blue">
                          Continue
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-google-red/10">
                      <Brain className="h-6 w-6 text-google-red" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Introduction to AI & ML</h3>
                      <p className="text-sm text-muted-foreground mb-3">Module 8: Supervised Learning</p>
                      <Progress value={40} className="h-2 mb-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">40% complete</span>
                        <Button variant="ghost" size="sm" className="text-google-red">
                          Continue
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">Unlock All Tracks</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Get Premium membership to access all learning tracks, certificates, and exclusive content.
            </p>
            <Button variant="google" size="lg">
              Upgrade to Premium
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LearningTracks;
