import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const TermsOfAgreement = () => {
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
          <h1 className="text-5xl font-bold mb-4">Terms of Agreement</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Last Updated: November 2025
          </p>

          <div className="space-y-8">
            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  These Terms of Agreement ("Terms") govern your use of UPSTRIDE's website and educational services. By accessing and using our platform, you agree to be bound by these terms. If you do not agree, please do not use our services.
                </p>
              </CardContent>
            </Card>

            {/* Use License */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">2. Use License</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Permission is granted to temporarily download one copy of the materials (information or software) on UPSTRIDE for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Modifying or copying the materials</li>
                  <li>Using the materials for any commercial purpose or for any public display</li>
                  <li>Attempting to decompile or reverse engineer any software contained on the platform</li>
                  <li>Removing any copyright or other proprietary notations from the materials</li>
                  <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                </ul>
              </CardContent>
            </Card>

            {/* Course Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">3. Course Terms and Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-bold text-foreground mb-2">Enrollment and Access</h4>
                  <p>
                    Upon enrollment and payment, you receive access to course materials for the duration specified. Access may be revoked for violation of these terms.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Course Content</h4>
                  <p>
                    All course materials, videos, documents, and resources are proprietary to UPSTRIDE and may not be reproduced, distributed, or shared without permission.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Completion and Certificates</h4>
                  <p>
                    Certificates are issued upon successful completion of course requirements. UPSTRIDE reserves the right to audit or revoke certificates if plagiarism or cheating is detected.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">4. Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Payment for courses is non-refundable except where required by law. Enrollments are valid from the date of payment and access continues for the specified duration. In case of technical issues preventing course access, contact our support team.
                </p>
              </CardContent>
            </Card>

            {/* Refund Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">5. Refund Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Refund requests must be submitted within 7 days of enrollment. No refunds are provided for courses already accessed. Special circumstances will be reviewed on a case-by-case basis.
                </p>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">6. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You agree to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide accurate information during enrollment</li>
                  <li>Use your account solely for your own learning</li>
                  <li>Not share your login credentials with others</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not engage in harassment, plagiarism, or cheating</li>
                </ul>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">7. Intellectual Property Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  All course materials, curriculum, videos, and content are owned by UPSTRIDE or licensed to us. You may not reproduce, distribute, or use these materials outside of the course without explicit permission.
                </p>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">8. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  UPSTRIDE is provided "as is" without warranties. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
                </p>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">9. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  UPSTRIDE reserves the right to modify these terms at any time. Changes will be posted on this page with an updated "Last Updated" date.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="bg-primary/5 border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl">10. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For questions about these terms, please contact:
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

export default TermsOfAgreement;
