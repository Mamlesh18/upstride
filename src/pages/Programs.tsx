import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Code2, Brain, ArrowLeft } from "lucide-react";

const Programs = () => {
  const navigate = useNavigate();

  const cseItPrograms = [
    { id: "python", name: "Fundamentals of Python" },
    { id: "fullstack", name: "Fullstack Web Development" },
    { id: "cloud", name: "Cloud Computing" },
    { id: "analytics", name: "Data Analytics" },
  ];

  const genAiPrograms = [
    { id: "datascience", name: "Data Science" },
    { id: "ai", name: "Fundamentals of AI" },
    { id: "ml", name: "Machine Learning" },
    { id: "cv", name: "Computer Vision" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-foreground">UPSTRIDE</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              Home
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-center mb-4">Our Programs</h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from 8 comprehensive programs across CSE/IT and Gen AI designed to transform your career
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* CSE/IT Programs */}
          <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 border-primary/30 overflow-hidden group">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle className="text-3xl group-hover:text-primary transition-colors">CSE/IT</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">Master core computer science and IT skills</p>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-3">
                {cseItPrograms.map((program, idx) => (
                  <Button
                    key={program.id}
                    variant="outline"
                    className="w-full justify-between hover:bg-primary/10 hover:border-primary/50 hover:translate-x-2 transition-all group/btn"
                    onClick={() => navigate(`/course/${program.id}`)}
                  >
                    <span className="font-medium group-hover/btn:text-primary transition-colors">{program.name}</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gen AI Programs */}
          <Card className="hover:shadow-2xl hover:scale-105 transition-all duration-300 border-primary/30 overflow-hidden group">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle className="text-3xl group-hover:text-primary transition-colors">Gen AI</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">Dive into AI, ML, and Data Science</p>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-3">
                {genAiPrograms.map((program) => (
                  <Button
                    key={program.id}
                    variant="outline"
                    className="w-full justify-between hover:bg-primary/10 hover:border-primary/50 hover:translate-x-2 transition-all group/btn"
                    onClick={() => navigate(`/course/${program.id}`)}
                  >
                    <span className="font-medium group-hover/btn:text-primary transition-colors">{program.name}</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center bg-primary/5 border-primary/20">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-primary mb-2">8</div>
              <p className="text-muted-foreground">Comprehensive Programs</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-primary/5 border-primary/20">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-primary mb-2">8 Weeks</div>
              <p className="text-muted-foreground">Structured Learning</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-primary/5 border-primary/20">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Industry Ready</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-8 w-8 object-contain" />
                <h3 className="text-xl font-bold text-foreground">UPSTRIDE</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Transforming careers through world-class online education. Certified by MSME, Government of India.
              </p>
              <a
                href="mailto:upstride.in@gmail.com"
                className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
              >
                upstride.in@gmail.com
              </a>
            </div>

            {/* CSE/IT Programs */}
            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">CSE/IT Programs</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/course/python")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Fundamentals of Python
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/fullstack")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Fullstack Web Development
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/cloud")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Cloud Computing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/analytics")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Data Analytics
                  </button>
                </li>
              </ul>
            </div>

            {/* Gen AI Programs */}
            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">Gen AI Programs</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/course/datascience")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Data Science
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/ai")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Fundamentals of AI
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/ml")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Machine Learning
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/cv")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Computer Vision
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/privacy-policy")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/terms")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Terms of Agreement
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/contact")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © 2024 UPSTRIDE Learning. All rights reserved.
              </p>
              <p className="text-muted-foreground text-sm">
                Recognized by MSME, Government of India
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Programs;
