import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full backdrop-blur-sm z-50 border-b border-border/20">
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Last Updated: November 2024
          </p>

          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  At UPSTRIDE, we are committed to protecting your privacy and ensuring a transparent experience. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and educational services.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold text-foreground mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Name, email address, and phone number</li>
                    <li>Academic background and educational goals</li>
                    <li>Billing and payment information</li>
                    <li>User account credentials</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Course Usage Information</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Course progress and completion status</li>
                    <li>Quiz and assignment scores</li>
                    <li>Video viewing history and duration</li>
                    <li>Login times and frequency</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Automatic Information</h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>IP address and device information</li>
                    <li>Browser type and operating system</li>
                    <li>Pages visited and time spent</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>• Providing and improving our educational services</p>
                <p>• Processing payments and course enrollment</p>
                <p>• Personalizing your learning experience</p>
                <p>• Sending course updates and announcements</p>
                <p>• Responding to your inquiries and support requests</p>
                <p>• Analyzing course effectiveness and student engagement</p>
                <p>• Complying with legal obligations</p>
                <p>• Preventing fraud and unauthorized access</p>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">3. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
                </p>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">4. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We retain your personal information as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data at any time, subject to legal requirements.
                </p>
              </CardContent>
            </Card>

            {/* Sharing Your Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">5. Sharing Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We do not sell your personal information. We may share information with:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Service providers assisting with course delivery</li>
                  <li>Payment processors for transactions</li>
                  <li>Legal authorities when required by law</li>
                  <li>Educational partners (with your consent)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">6. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Us */}
            <Card className="bg-primary/5 border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl">7. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For privacy-related inquiries, please contact us at:
                </p>
                <a
                  href="mailto:upstride.in@gmail.com"
                  className="text-primary hover:text-primary/80 font-bold transition-colors"
                >
                  upstride.in@gmail.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-8 w-8 object-contain" />
                <h3 className="text-xl font-bold text-foreground">UPSTRIDE</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Transforming careers through world-class online education.
              </p>
              <a
                href="mailto:upstride.in@gmail.com"
                className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
              >
                upstride.in@gmail.com
              </a>
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/privacy-policy")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
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
            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:upstride.in@gmail.com"
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Email Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
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

export default PrivacyPolicy;
