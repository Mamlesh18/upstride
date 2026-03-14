import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Rocket, Phone, Menu, X, Shield, Star, Users, Compass, Layers, Zap, Eye, MessageSquare } from "lucide-react";
import SocialProof from "@/components/SocialProof";
import { toast } from "@/hooks/use-toast";

const weeks = [
  {
    num: 1,
    phase: "Uncover",
    desc: "Discover why most students don't get placed — and what you'll do differently from day one",
    icon: Compass,
  },
  {
    num: 2,
    phase: "Blueprint",
    desc: "Build a resume, strategy, and identity that actually reflects your true potential",
    icon: Layers,
  },
  {
    num: 3,
    phase: "Amplify",
    desc: "Create projects and a LinkedIn presence that makes recruiters reach out to you",
    icon: Zap,
  },
  {
    num: 4,
    phase: "Insider Edge",
    desc: "Learn what HR really thinks and wants — straight from people inside the industry",
    icon: Eye,
  },
  {
    num: 5,
    phase: "Win the Room",
    desc: "Master every interview format and answer any question with confidence and clarity",
    icon: MessageSquare,
  },
  {
    num: 6,
    phase: "Launch",
    desc: "Walk out with offers, a powerful network, and unstoppable career momentum",
    icon: Rocket,
  },
];

const Programs = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const dateTime = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "long",
      });

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "f4edb229-9419-4f5c-a18f-8f67c1ec3082",
          subject: "🔥 New Call Request - UPSTRIDE Career Launchpad",
          from_name: "UPSTRIDE Website",
          to: "mamlesh.va06@gmail.com",
          phone: phoneNumber,
          name: "Career Launchpad Inquiry",
          message: `
📞 NEW CALL REQUEST FROM UPSTRIDE WEBSITE

Phone Number: ${phoneNumber}
Date & Time: ${dateTime}
Source Page: Programs Page (The Career Launchpad)
Program Interest: The Career Launchpad — 6-Week Program

---
ACTION REQUIRED: Call this number within 24 hours as promised on the website.

Browser Info: ${navigator.userAgent}
          `.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "You're on the list!",
          description: "Our founder will call you personally within 24 hours.",
        });
        setPhoneNumber("");
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      toast({
        title: "Submission Failed",
        description: "Please try again or reach us at upstride.in@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SocialProof />

      {/* Decorative Color Element */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-80 blur-xl animate-pulse" />
        <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-primary opacity-60 blur-lg animate-float" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full backdrop-blur-sm z-40 border-b border-border/20">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-foreground">UPSTRIDE</h1>
          </div>
          <div className="hidden md:flex gap-4">
            <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
            <Button variant="ghost" onClick={() => navigate("/login")}>Portal</Button>
          </div>
          <button
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-2 flex flex-col gap-1">
              <Button variant="ghost" className="justify-start w-full" onClick={() => { navigate("/"); setMobileMenuOpen(false); }}>Home</Button>
              <Button variant="ghost" className="justify-start w-full" onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}>Portal</Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-28 pb-20 relative">
        {/* Background Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-10 right-0 w-[480px] h-[480px] bg-gradient-to-br from-primary/25 via-purple-500/20 to-pink-500/25 rounded-full blur-3xl animate-move-left-right" />
          <div className="absolute top-1/3 right-20 w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/20 via-blue-500/25 to-primary/20 rounded-full blur-3xl animate-move-diagonal-1" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-gradient-to-tl from-purple-500/20 via-pink-400/20 to-primary/25 rounded-full blur-3xl animate-move-up-down" style={{ animationDelay: "4s" }} />
          <div className="absolute top-2/3 -left-20 w-[360px] h-[360px] bg-gradient-to-br from-pink-400/25 via-blue-400/20 to-cyan-400/25 rounded-full blur-3xl animate-move-right-left" style={{ animationDelay: "1s" }} />
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-10 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <div className="text-center mb-24 animate-fade-in">
          <div className="mb-5 inline-flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-semibold border border-primary/20 tracking-wide uppercase">
              UPSTRIDE presents
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-none mb-4">
            <span className="text-foreground">The Career</span>
            <br />
            <span
              className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-text-gradient"
            >
              Launchpad
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-bold text-foreground/60 mb-6 tracking-tight">
            6 Weeks. One Transformation. Unlimited Future.
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Just imagine — 6 weeks from now, you could have your first offer in hand.
            Not by luck. By design. By doing exactly what we've helped 250+ students do before you.
          </p>
        </div>

        {/* ── 6-WEEK JOURNEY ───────────────────────────────────── */}
        <div className="max-w-5xl mx-auto mb-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              What happens in those 6 weeks?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Six phases. Each one carefully engineered to take you closer to your first offer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {weeks.map((week) => (
              <div
                key={week.num}
                className="group relative bg-background border border-border rounded-2xl p-6 hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-default overflow-hidden animate-reveal-up"
                style={{ animationDelay: `${(week.num - 1) * 100}ms` }}
              >
                {/* Hover bg glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-purple-500/0 to-pink-500/0 group-hover:from-primary/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 rounded-2xl" />

                <div className="relative">
                  {/* Week number + icon row */}
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="text-6xl font-black leading-none text-primary/15 group-hover:text-primary/30 transition-colors duration-300 animate-number-pop"
                      style={{ animationDelay: `${(week.num - 1) * 100 + 200}ms` }}
                    >
                      {String(week.num).padStart(2, "0")}
                    </span>
                    <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 mt-1">
                      <week.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {week.phase}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {week.desc}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-muted-foreground italic text-base">
            Each phase builds on the last — by week 6, you're not just ready, you're{" "}
            <span className="text-primary font-bold not-italic">unstoppable.</span>
          </p>
        </div>

        {/* ── THE CTA ───────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto mb-20">
          {/* Glowing wrapper */}
          <div className="relative group animate-glow-pulse rounded-3xl">
            {/* Animated blur glow behind the card */}
            <div
              className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-gradient"
              style={{ backgroundSize: "200% 200%" }}
            />

            <div className="relative bg-background border-2 border-primary/20 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20 mb-6">
                  <Phone className="w-4 h-4" />
                  Our founder calls you personally
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">
                  One conversation can
                  <br />
                  <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent animate-text-gradient">
                    change everything.
                  </span>
                </h2>

                <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Drop your number below. Our founder will call you personally —
                  no scripts, no pressure, no sales pitch. Just an honest conversation
                  about where you are and how 6 weeks can completely transform your career.
                </p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <Input
                    type="tel"
                    placeholder="Your 10-digit phone number"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="flex-1 h-14 text-lg text-center sm:text-left border-primary/30 focus:border-primary"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="h-14 bg-primary hover:bg-primary/90 text-white px-8 text-base font-bold shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
                    disabled={isSubmitting || phoneNumber.length !== 10}
                  >
                    {isSubmitting ? "Sending..." : "Get My Call →"}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <span className="text-green-500 font-bold">✓</span> Founder calls personally
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <span className="text-green-500 font-bold">✓</span> Zero spam, ever
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <span className="text-green-500 font-bold">✓</span> Response within 24 hours
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── TRUST BAR ────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-secondary/30 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in animate-stagger-1">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-4xl font-black text-foreground mb-1">250+</div>
              <p className="text-sm text-muted-foreground font-medium">Students Trained</p>
            </div>
            <div className="text-center p-6 bg-secondary/30 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in animate-stagger-2">
              <Star className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-4xl font-black text-foreground mb-1">30+</div>
              <p className="text-sm text-muted-foreground font-medium">Offers After Training</p>
            </div>
            <div className="text-center p-6 bg-secondary/30 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in animate-stagger-3">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-4xl font-black text-foreground mb-1">MSME</div>
              <p className="text-sm text-muted-foreground font-medium">Government Certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary/30 border-t border-border mt-8">
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
              <a href="mailto:upstride.in@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                upstride.in@gmail.com
              </a>
              <p className="text-sm text-muted-foreground">© 2026 UPSTRIDE Learning. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Programs;
