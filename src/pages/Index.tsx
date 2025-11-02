import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { GraduationCap, Users, Award, TrendingUp, Heart, Clock, Code2, Brain, Mail, ChevronDown, Star, ChevronLeft, ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Priya Singh",
      course: "Fundamentals of Python",
      review: "UPSTRIDE transformed my programming skills! The instructors are amazing and the course structure is perfect for beginners. I landed a job within 2 months!",
      rating: 5
    },
    {
      name: "Arjun Patel",
      course: "Fullstack Web Development",
      review: "Best investment for my career! Learned React, Node.js, and databases from scratch. The projects were real-world and helped me build a strong portfolio.",
      rating: 5
    },
    {
      name: "Neha Gupta",
      course: "Machine Learning",
      review: "The ML course is comprehensive and well-structured. Mentors are always available for doubts. I can now build ML models confidently!",
      rating: 5
    },
    {
      name: "Rahul Sharma",
      course: "Data Analytics",
      review: "From complete beginner to analytics expert in 8 weeks! The course covered everything - Excel, SQL, Tableau, and Python. Highly recommended!",
      rating: 5
    },
    {
      name: "Isha Verma",
      course: "Cloud Computing",
      review: "Outstanding course! Learned AWS, Docker, and Kubernetes in a structured way. The capstone project was excellent preparation for real-world scenarios.",
      rating: 5
    }
  ];

  // Auto-scroll testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const cseItPrograms = [
    { id: "python", name: "Fundamentals of Python", icon: Code2 },
    { id: "fullstack", name: "Fullstack Web Development", icon: Code2 },
    { id: "cloud", name: "Cloud Computing", icon: Code2 },
    { id: "analytics", name: "Data Analytics", icon: Code2 },
  ];

  const genAiPrograms = [
    { id: "datascience", name: "Data Science", icon: Brain },
    { id: "ai", name: "Fundamentals of AI", icon: Brain },
    { id: "ml", name: "Machine Learning", icon: Brain },
    { id: "cv", name: "Computer Vision", icon: Brain },
  ];

  const features = [
    { icon: TrendingUp, title: "Industry Level Curriculum", description: "Learn with cutting-edge content" },
    { icon: GraduationCap, title: "Hands-on Learning", description: "Practical experience with real projects" },
    { icon: Users, title: "Career Mentorship", description: "Guidance by top professionals" },
    { icon: Award, title: "Comprehensive Career Support", description: "Complete job placement assistance" },
    { icon: Heart, title: "Inclusive Environment", description: "Supportive learning community" },
    { icon: Clock, title: "Flexible Learning", description: "Accessible anytime, anywhere" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b overflow-visible">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center overflow-visible">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-foreground">UPSTRIDE</h1>
          </div>
          <div className="flex gap-4 items-center">
            <Button variant="ghost" onClick={() => scrollToSection("home")}>
              Home
            </Button>
            <div
              className="relative group"
              onMouseEnter={() => setOpenDropdown("programs")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Button variant="ghost" className="flex items-center gap-2">
                Programs
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </Button>

              {/* Dropdown Menu */}
              {openDropdown === "programs" && (
                <div
                  className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-xl p-6 w-96 z-50"
                  onMouseEnter={() => setOpenDropdown("programs")}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {/* CSE/IT Section */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Code2 className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg">CSE/IT</h3>
                    </div>
                    <div className="space-y-2">
                      {cseItPrograms.map((program) => (
                        <button
                          key={program.id}
                          onClick={() => {
                            navigate(`/course/${program.id}`);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium"
                        >
                          {program.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    {/* Gen AI Section */}
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-lg">Gen AI</h3>
                    </div>
                    <div className="space-y-2">
                      {genAiPrograms.map((program) => (
                        <button
                          key={program.id}
                          onClick={() => {
                            navigate(`/course/${program.id}`);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-3 py-2 rounded hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium"
                        >
                          {program.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>

        <div className="text-center animate-fade-in relative z-10">
          <div className="mb-6 inline-block">
            <span className="bg-primary/20 text-primary px-6 py-2 rounded-full text-sm font-semibold">Welcome to Learning Excellence</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-foreground bg-clip-text">
            UPSTRIDE
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground font-light mb-2">
            Learn, Grow and Excel
          </p>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master industry-relevant skills with expert-led courses designed for college students and professionals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => navigate("/programs")}
            >
              Explore Programs
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10 shadow-lg"
              onClick={() => window.location.href = "mailto:upstride.in@gmail.com?subject=Course Inquiry"}
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>


      {/* Programs Section */}
      <section id="programs" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center">Our Programs</h2>
          <p className="text-center text-muted-foreground text-lg mb-16">Choose from 8 comprehensive programs designed for your success</p>

          {/* CSE/IT Programs */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Code2 className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-bold">CSE/IT Programs</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {cseItPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group overflow-hidden"
                  onClick={() => navigate(`/course/${program.id}`)}
                >
                  <CardHeader className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-colors">
                    <CardTitle className="group-hover:text-primary transition-colors">{program.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Click to explore curriculum</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Gen AI Programs */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Brain className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-bold">Gen AI Programs</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {genAiPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="hover:shadow-2xl hover:scale-105 transition-all cursor-pointer group overflow-hidden"
                  onClick={() => navigate(`/course/${program.id}`)}
                >
                  <CardHeader className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-colors">
                    <CardTitle className="group-hover:text-primary transition-colors">{program.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Click to explore curriculum</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <h3 className="text-3xl font-bold mb-8 text-center mt-20">Why Choose UPSTRIDE</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all hover:-translate-y-2 group overflow-hidden">
                <CardHeader className="group-hover:bg-primary/5 transition-colors">
                  <feature.icon className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Student Testimonials Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4">Feedbacks from Students</h2>
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            Hear from our amazing students who have transformed their careers with UPSTRIDE
          </p>

          {/* Testimonial Carousel */}
          <div className="relative">
            <Card className="border-primary/30 shadow-2xl bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
              <CardContent className="pt-12 pb-12">
                {/* Current Testimonial */}
                <div className="text-center px-8 md:px-16 min-h-96 flex flex-col justify-center">
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-primary text-primary" />
                    ))}
                  </div>

                  <blockquote className="text-2xl md:text-3xl font-light italic text-foreground mb-8">
                    "{testimonials[currentTestimonial].review}"
                  </blockquote>

                  <div className="space-y-2">
                    <p className="text-xl font-bold text-primary">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-muted-foreground text-lg">
                      {testimonials[currentTestimonial].course}
                    </p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-12 px-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="hover:bg-primary/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  {/* Dots */}
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentTestimonial ? "bg-primary w-8" : "bg-primary/30"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                    className="hover:bg-primary/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* MSME Recognition Section - SHORT */}
      <section className="py-12 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-white/50 backdrop-blur-sm border-primary/30 shadow-lg">
            <CardContent className="py-8 flex items-center justify-center gap-8 flex-wrap">
              <img
                src="/SONASIS-MSME.webp"
                alt="SONASIS MSME Certification"
                className="h-24 md:h-32 object-contain hover:scale-105 transition-transform"
              />
              <div className="text-center md:text-left">
                <p className="text-xl font-bold text-primary mb-2">Recognized by MSME</p>
                <p className="text-muted-foreground">
                  Certified and approved by Ministry of Micro, Small & Medium Enterprises (MSME), Government of India
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-2 border-primary/30 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
              <CardTitle className="text-3xl text-center">Get in Touch</CardTitle>
              <CardDescription className="text-center text-base mt-2">Have questions? Contact us directly</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <Mail className="w-16 h-16 text-primary" />
                <div className="text-center">
                  <p className="text-lg text-muted-foreground mb-4">Reach out to our team</p>
                  <a
                    href="mailto:upstride.in@gmail.com"
                    className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors break-all"
                  >
                    upstride.in@gmail.com
                  </a>
                </div>
                <Button
                  className="mt-6 bg-primary hover:bg-primary/90 text-lg px-8"
                  onClick={() => window.location.href = "mailto:upstride.in@gmail.com"}
                >
                  Send Email Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

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

export default Index;
