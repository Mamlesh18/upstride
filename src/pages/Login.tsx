import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const loginTimestamp = localStorage.getItem("loginTimestamp");

    if (isAuthenticated && loginTimestamp) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(loginTimestamp);
      const oneHour = 3600000;

      // If token is still valid, redirect to portal
      if (timeDifference <= oneHour) {
        navigate("/portal");
      } else {
        // Token expired, clear auth data
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("loginTimestamp");
        localStorage.removeItem("userEmail");
      }
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate credentials
    const validEmail = "upstrideintern@gmail.com";
    const validPassword = "upstride#04";

    setTimeout(() => {
      if (email === validEmail && password === validPassword) {
        // Store authentication token with timestamp (expires in 1 hour)
        const loginTime = new Date().getTime();
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("loginTimestamp", loginTime.toString());
        localStorage.setItem("userEmail", email);

        toast({
          title: "Success!",
          description: "You have been logged in successfully",
        });

        setIsLoading(false);
        // Redirect to portal
        navigate("/portal");
      } else {
        toast({
          title: "Invalid Credentials",
          description: "The email or password you entered is incorrect",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Aesthetic Moving Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 via-purple-500/20 to-pink-500/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/25 via-blue-500/30 to-primary/25 rounded-full blur-3xl animate-float-medium" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-2 border-primary/20 shadow-2xl">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Lock className="w-12 h-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black">Student Portal Login</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login to Portal"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Don't have access? Contact your instructor
              </p>
              <a
                href="mailto:upstride.in@gmail.com"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                upstride.in@gmail.com
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By logging in, you agree to our{" "}
            <button
              onClick={() => navigate("/terms")}
              className="text-primary hover:underline"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              onClick={() => navigate("/privacy-policy")}
              className="text-primary hover:underline"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
