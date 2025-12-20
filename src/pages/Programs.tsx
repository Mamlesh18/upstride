import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Rocket, Target, Users, TrendingUp, Award, Calendar } from "lucide-react";

const Programs = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Strategic Approach",
      description: "Learn proven frameworks for building lasting customer relationships"
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Get guidance from industry leaders with years of sales experience"
    },
    {
      icon: TrendingUp,
      title: "Real Results",
      description: "Apply techniques that drive measurable sales growth"
    },
    {
      icon: Award,
      title: "Certification",
      description: "Earn a recognized credential upon completion"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative Color Element - Top Right */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-80 blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-primary opacity-60 blur-lg animate-float"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-40 border-b border-border/50">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-foreground">UPSTRIDE</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Portal
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-20 relative">
        {/* Aesthetic Moving Gradient Orbs - Traversing */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          {/* Right to Left Movement */}
          <div className="absolute top-10 right-0 w-[480px] h-[480px] bg-gradient-to-br from-primary/25 via-purple-500/20 to-pink-500/25 rounded-full blur-3xl animate-move-left-right"></div>

          {/* Diagonal Movement */}
          <div className="absolute top-1/3 right-20 w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/20 via-blue-500/25 to-primary/20 rounded-full blur-3xl animate-move-diagonal-1" style={{ animationDelay: '2s' }}></div>

          {/* Up and Down Movement */}
          <div className="absolute -bottom-40 right-1/4 w-[420px] h-[420px] bg-gradient-to-tl from-purple-500/20 via-pink-400/20 to-primary/25 rounded-full blur-3xl animate-move-up-down" style={{ animationDelay: '4s' }}></div>

          {/* Left to Right Movement */}
          <div className="absolute top-2/3 -left-20 w-[360px] h-[360px] bg-gradient-to-br from-pink-400/25 via-blue-400/20 to-cyan-400/25 rounded-full blur-3xl animate-move-right-left" style={{ animationDelay: '1s' }}></div>
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Hero Section */}
        <div className="mb-20 text-center animate-fade-in">
          <div className="mb-6 inline-block">
            <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-medium border border-primary/20">
              Experience-Driven Learning
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-foreground tracking-tight">
            Experience Selling Bootcamp
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-normal leading-relaxed">
            We are not selling courses, we are selling experience. An 8-week journey connecting the gap between students and industry via an experience-driven approach.
          </p>
        </div>

        {/* Main Course Card */}
        <div className="max-w-5xl mx-auto mb-20 animate-scale-in">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl overflow-hidden group">
            <CardHeader className="bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 pb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                  <Rocket className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-4xl font-black mb-2">Experience Selling Bootcamp</CardTitle>
                  <CardDescription className="text-base">8-Week Intensive Program</CardDescription>
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We are not selling courses, we are selling experience. This transformative bootcamp connects students with industry through real-world projects, expert mentorship, and practical skills that matter. Get placed, build your career, and excel.
              </p>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-all duration-300 animate-fade-in animate-stagger-${index + 1}`}
                  >
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium py-6 group/btn"
                  onClick={() => navigate("/course/experience-selling")}
                >
                  View Full Curriculum
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-6"
                  onClick={() => window.open("https://chat.whatsapp.com/K1eY2yOQ2Gt0NF5FzSpnMh", "_blank")}
                >
                  Enroll Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center bg-background border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in animate-stagger-1">
            <CardContent className="pt-10 pb-10">
              <Calendar className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-5xl font-black text-foreground mb-3">8 Weeks</div>
              <p className="text-muted-foreground font-medium">Intensive Learning</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-background border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in animate-stagger-2">
            <CardContent className="pt-10 pb-10">
              <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-5xl font-black text-foreground mb-3">100%</div>
              <p className="text-muted-foreground font-medium">Practical Focus</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-background border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in animate-stagger-3">
            <CardContent className="pt-10 pb-10">
              <Award className="w-10 h-10 text-primary mx-auto mb-4" />
              <div className="text-5xl font-black text-foreground mb-3">1:1</div>
              <p className="text-muted-foreground font-medium">Mentorship Support</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-8 w-8 object-contain" />
              <div>
                <h3 className="text-lg font-bold text-foreground">UPSTRIDE</h3>
                <p className="text-xs text-muted-foreground">Certified by MSME, Government of India</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <a
                href="mailto:upstride.in@gmail.com"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                upstride.in@gmail.com
              </a>
              <p className="text-sm text-muted-foreground">
                © 2024 UPSTRIDE Learning. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Programs;
