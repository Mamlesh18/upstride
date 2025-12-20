import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { GraduationCap, Users, Award, TrendingUp, Heart, Clock, Mail, Star, ChevronLeft, ChevronRight, Briefcase, UserCheck, Building2, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Shrusti",
      linkedin: "https://www.linkedin.com/in/shrusti-d-bhujange-834515382/",
      review: "The Experience Selling Bootcamp completely changed my perspective on placements. The mock interview session and LinkedIn building strategies helped me land my internship!",
      rating: 5
    },
    {
      name: "Divya",
      linkedin: "https://www.linkedin.com/in/divya-sood-8b205b374/",
      review: "Learning about 'Resume vs Reality' was eye-opening. The mentors showed me exactly what HR thinks and wants. I got placed within a month of completing the bootcamp!",
      rating: 5
    },
    {
      name: "Jessica",
      linkedin: "https://www.linkedin.com/in/jessica-c7684/",
      review: "The project ideation and execution sessions were game-changers. I built a portfolio that actually stands out. The networking strategies really work!",
      rating: 5
    },
    {
      name: "Praneeth",
      linkedin: "https://www.linkedin.com/in/praneeth-v-p/",
      review: "From learning time management to becoming a top 1% coder mindset - this bootcamp covers everything. The guest talk and mentorship were invaluable!",
      rating: 5
    },
    {
      name: "Uwais",
      linkedin: "https://www.linkedin.com/in/mohammed-uwais-58892132b/",
      review: "Best decision I made for my career! The entrepreneurship thinking and leadership sessions opened my eyes. Got my full-time offer during the bootcamp itself!",
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
      {/* Decorative Color Element - Top Right */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-80 blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-primary opacity-60 blur-lg animate-float"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-40 border-b border-border/50 overflow-visible">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center overflow-visible">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-foreground">UPSTRIDE</h1>
          </div>
          <div className="flex gap-4 items-center">
            <Button variant="ghost" onClick={() => scrollToSection("home")}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/programs")}>
              Programs
            </Button>
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Portal
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-20 bg-background relative overflow-hidden">
        {/* Aesthetic Moving Gradient Orbs - Traversing Across Screen */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Orb 1: Moving Right to Left */}
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/30 rounded-full blur-3xl animate-move-left-right"></div>

          {/* Orb 2: Moving Left to Right */}
          <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] bg-gradient-to-br from-cyan-400/25 via-blue-500/30 to-primary/25 rounded-full blur-3xl animate-move-right-left" style={{ animationDelay: '3s' }}></div>

          {/* Orb 3: Moving Up and Down */}
          <div className="absolute -top-40 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-purple-500/20 via-pink-400/25 to-primary/20 rounded-full blur-3xl animate-move-up-down" style={{ animationDelay: '2s' }}></div>

          {/* Orb 4: Moving Down to Up */}
          <div className="absolute bottom-0 right-20 w-[350px] h-[350px] bg-gradient-to-br from-pink-400/30 via-purple-400/25 to-blue-400/20 rounded-full blur-3xl animate-move-down-up" style={{ animationDelay: '5s' }}></div>

          {/* Orb 5: Diagonal Movement 1 */}
          <div className="absolute top-1/2 right-10 w-[380px] h-[380px] bg-gradient-to-br from-blue-400/20 via-cyan-400/25 to-primary/30 rounded-full blur-3xl animate-move-diagonal-1" style={{ animationDelay: '1s' }}></div>

          {/* Orb 6: Diagonal Movement 2 */}
          <div className="absolute bottom-1/4 -left-20 w-[420px] h-[420px] bg-gradient-to-br from-primary/35 via-blue-400/20 to-purple-400/25 rounded-full blur-3xl animate-move-diagonal-2" style={{ animationDelay: '4s' }}></div>

          {/* Orb 7: Circular Movement */}
          <div className="absolute top-1/4 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-pink-500/25 via-purple-500/20 to-cyan-400/25 rounded-full blur-3xl animate-move-circular" style={{ animationDelay: '6s' }}></div>
        </div>

        <div className="text-center animate-fade-in relative z-10 px-4">
          <div className="mb-8 inline-block">
            <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-medium border border-primary/20">
              Welcome to Learning Excellence
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 text-foreground tracking-tight">
            UPSTRIDE
          </h1>
          <p className="text-2xl md:text-4xl text-foreground/80 font-medium mb-4 tracking-tight">
            We are not selling course, we are selling experience
          </p>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-normal">
            Connecting the gap between students and indsutry via a experiece driven approach to make your carrer easier
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300 text-base font-medium px-8 py-6 rounded-lg"
              onClick={() => navigate("/programs")}
            >
              Explore Programs
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-secondary transition-all duration-300 text-base font-medium px-8 py-6 rounded-lg"
              onClick={() => window.location.href = "mailto:upstride.in@gmail.com?subject=Course Inquiry"}
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Stats & Credentials Section */}
      <section className="py-20 px-4 bg-secondary/30 border-y border-border">
        <div className="container mx-auto max-w-7xl">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
            {/* Students Trained */}
            <div className="text-center p-6 bg-background rounded-xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in">
              <UserCheck className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3" />
              <div className="text-4xl md:text-5xl font-black text-foreground mb-2">100+</div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">Students Trained</p>
            </div>

            {/* Placements */}
            <div className="text-center p-6 bg-background rounded-xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in animate-stagger-1">
              <Briefcase className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3" />
              <div className="text-4xl md:text-5xl font-black text-foreground mb-2">20+</div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">Internships & Full-Time</p>
            </div>

            {/* Industry Mentors */}
            <div className="text-center p-6 bg-background rounded-xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in animate-stagger-2">
              <Building2 className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-black text-foreground mb-2">Google, Wipro, Zoho</div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">Industry Mentors</p>
            </div>

            {/* MSME Registered */}
            <div className="text-center p-6 bg-background rounded-xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-fade-in animate-stagger-3">
              <Shield className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3" />
              <div className="text-xl md:text-2xl font-black text-foreground mb-2">MSME Registered</div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">Government Certified</p>
            </div>
          </div>

          {/* Clutch Recognition */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-background rounded-2xl p-10 border-2 border-primary/20 animate-scale-in shadow-lg">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">Recognized by Clutch</h3>
                <p className="text-base md:text-lg text-muted-foreground">Leading B2B ratings and reviews platform</p>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white p-4 rounded-xl shadow-md">
              <img
                src="/Clutch.png"
                alt="Clutch Recognition Badge"
                className="h-24 md:h-32 w-auto object-contain hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials Section */}
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Student Feedbacks</h2>
          <p className="text-center text-muted-foreground text-sm mb-8 max-w-xl mx-auto">
            Hear from students who transformed their careers
          </p>

          {/* Testimonial Carousel */}
          <div className="relative">
            <Card className="border-primary/30 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
              <CardContent className="pt-6 pb-6">
                {/* Current Testimonial */}
                <div className="text-center px-6 md:px-12">
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  <blockquote className="text-base md:text-lg font-normal italic text-foreground mb-4 line-clamp-3">
                    "{testimonials[currentTestimonial].review}"
                  </blockquote>

                  <div className="space-y-2">
                    <p className="text-base font-bold text-primary">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <a
                      href={testimonials[currentTestimonial].linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-6 px-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10"
                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {/* Dots */}
                  <div className="flex gap-1.5">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentTestimonial ? "bg-primary w-6" : "bg-primary/30"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10"
                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-12 mb-12 max-w-5xl mx-auto">
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

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/programs")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Experience Selling Bootcamp
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Student Portal
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
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © 2026 UPSTRIDE Learning. All rights reserved.
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
