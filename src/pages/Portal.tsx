import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Mail, Linkedin, ListChecks, FileCode, MessageSquare, Building2, Brain, Code2, Target, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Portal = () => {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("userEmail");

    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });

    navigate("/login");
  };

  const trainingResources = [
    { id: 1, name: "Cover Letter Templates", icon: FileText, description: "Professional cover letter templates", url: "https://docs.google.com/document/d/11P_LLTpx16Z83EW8u_YVY9l05x7SKU950PTWJQuzJhQ/edit?usp=sharing" },
    { id: 2, name: "Email To Send To HR", icon: Mail, description: "Email templates for HR outreach", url: "https://docs.google.com/document/d/1CSSgkt1qBU9oSXSKALrpy_89MfmkZvJ7vr4z9FRr1uE/edit?usp=sharing" },
    { id: 3, name: "LinkedIn Message To HR", icon: Linkedin, description: "LinkedIn message templates", url: "https://docs.google.com/document/d/1KXw6R6RgB_37-3JiQnB9DleoAlMJJTZObIP3M96BqTo/edit?usp=sharing" },
    { id: 4, name: "LinkedIn Review", icon: Linkedin, description: "Get your LinkedIn profile reviewed", url: "https://docs.google.com/document/d/1ZUQvHMoMxXjm-G1uGGkQZ1YNj5VNndU5LgE3cfu8IsE/edit?usp=sharing" },
    { id: 5, name: "List of Companies Mail", icon: ListChecks, description: "Company contact database", url: "https://docs.google.com/document/d/1qTrPuIWZPXmOcKW2qmNbzyqgUqvamy1t7OXgVeS_FPw/edit?usp=sharing" },
    { id: 6, name: "Mamlesh VA Resume AI", icon: FileCode, description: "AI-powered resume builder", url: "https://docs.google.com/document/d/15lwb2eYty-uf1Y8VRrl19CLPljPAdqbf/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true" },
    { id: 7, name: "Most Asked DSA Questions", icon: Code2, description: "Top DSA interview questions", url: "https://docs.google.com/document/d/1UUfEZWFUJw3GihrBcSjdKlAXHAklg7fd9qnvrh45Dc0/edit?usp=sharing" },
    { id: 8, name: "Resume Review", icon: FileText, description: "Get your resume reviewed", url: "https://docs.google.com/document/d/16yLxoy-qZUZ9SRrqJQeL_tVqy4bc5liA39R9T8yyrSs/edit?usp=sharing" },
    { id: 9, name: "Top 50 LLM Interview Questions", icon: MessageSquare, description: "LLM interview preparation", url: "https://docs.google.com/document/d/1J7L8THutNBC7iapuyiTw9hfIYsO_-U5FxWgt-lVZFvM/edit?usp=sharing" },
  ];

  const companies = [
    { name: "Accenture", logo: "🏢" },
    { name: "Cognizant", logo: "🏢" },
    { name: "HCL", logo: "🏢" },
    { name: "Infosys", logo: "🏢" },
    { name: "L&T", logo: "🏢" },
    { name: "TCS", logo: "🏢" },
    { name: "Wipro", logo: "🏢" },
    { name: "Zoho", logo: "🏢" },
  ];

  const companyResources: Record<string, Record<string, string>> = {
    "Accenture": {
      "Aptitude": "https://docs.google.com/document/d/1kyy6vP1UhgqHd11T3Dsx7ofvW3DmgA1uhVRZJQXXfGw/edit?usp=sharing",
      "DSA": "https://docs.google.com/document/d/1SGK-t4IeF7gitZLQjVgo8m4V4f9I9FbCVwn5OzKwylY/edit?usp=sharing",
      "Technical Interview": "https://docs.google.com/document/d/1jJjApMcSJJ_1aGwkht7eOoEltwlKDQrm3c4Wqch_3-4/edit?usp=sharing"
    },
    "HCL": {
      "Aptitude": "https://docs.google.com/document/d/1RJOQcA-2el8Vazcd9LvjAcQdFINEirK1JH7JcuhHBEM/edit?usp=sharing",
      "DSA": "https://docs.google.com/document/d/1qTLCSjjBNjslaJCxM3AKSn5fLBtJIJ0Y2ith2qlyGKM/edit?usp=sharing",
      "Technical Interview": "https://docs.google.com/document/d/1j4W_yPgA2Uhr-O9Y2q6ZaEQkv8UfUNVZxdhcRfFz1hM/edit?usp=sharing"
    },
    "Infosys": {
      "Aptitude": "https://docs.google.com/document/d/1CD13NBJ9i-z4JtCXN4sy0piryA3KH3waVhA-3sPmTF8/edit?usp=sharing",
      "DSA": "https://docs.google.com/document/d/1ygYv7-tkO2t2MRDGZxVPQMcYRP8RxO5NQGDo9hWA7fs/edit?usp=sharing",
      "Technical Interview": "https://docs.google.com/document/d/1f1cAMLgh0sH82oc3hhnJjs1aoE6ioj_eY71oZ7NCer8/edit?usp=sharing"
    },
    "Cognizant": {
      "Aptitude": "https://docs.google.com/document/d/1-wGB0YG0sb3Jmup33CO-RBQF712lRH9UiVih0L_hvuY/edit?usp=sharing",
      "DSA": "https://docs.google.com/document/d/1J93SNR-tSzz9ggy0HNXoNMWJ0rEMn-aUz2_06oEYNjc/edit?usp=sharing",
      "Technical Interview": "https://docs.google.com/document/d/1WCWHFlh8x1Q8WIBqwx5NXi-Z1_-EyzTvYTep5MoWFjU/edit?usp=sharing"
    },
    "Zoho": {
      "Aptitude": "https://docs.google.com/document/d/1ajZ4SQxeaUpHzLF5CaCW4y0RCfcp-jJhctaJiDwgf7Q/edit?usp=sharing",
      "DSA": "https://docs.google.com/document/d/1OKJkV2099PtdbVHe7Zp5Uxh5Noh4l-vhKfzOEq4_Ht8/edit?usp=sharing",
      "Technical Interview": "https://docs.google.com/document/d/1iv2hJyuhJcyUIYoq1_-a6bSZQMT__gGmBcDUx5hmOCw/edit?usp=sharing"
    },
    "Wipro": {
      "Aptitude": "https://docs.google.com/document/d/1oxrqck6pqx5Z9shgucgoXdckQGu6pmyGiqfuu8Ni5Gk/edit?usp=sharing",
      "DSA": "https://docs.google.com/document/d/16AHBdaYFd4TIEenY6VHv-gzA5Luo1szTjHPRvOV1v30/edit?usp=sharing",
      "Technical Interview": "https://docs.google.com/document/d/1nRIZprV89KQkC6BNFsgo-2D9qAKJnT1rKorI4aRZo0E/edit?usp=sharing"
    },
    "L&T": {
      "Aptitude": "https://docs.google.com/document/d/1f9ikBZZWRH0jz4LGKsrsv5hdaR6ohTCBPG6Yr8BZZCQ/edit?usp=sharing",
      "DSA": "https://docs.google.com/document/d/1g-nqsyxbFU8JhleCai_twzNn96MOk7A3Bo2yVYQNfkc/edit?usp=sharing",
      "Technical Interview": "https://docs.google.com/document/d/14KBq0zzMsIxOUfOv2NTDz-ccr71spBE7I92AdRIdqLc/edit?usp=sharing"
    },
    "TCS": {
      "Aptitude": "https://docs.google.com/document/d/1zHWsyH_0MiEjgmvbq5tMc6shIyI_c_XEKokLY5CQwMQ/edit?usp=sharing",
      "DSA": "https://docs.google.com/document/d/1fL8sS_cC4ImXlkt0XoEl1-s6ap2cZAFxwRQ0MXCGiN8/edit?usp=sharing",
      "Technical Interview": "https://docs.google.com/document/d/1heVx7vV7fLv8ZWRePmV5gGmIuUSSkbRGuGPcAR3zs30/edit?usp=sharing"
    }
  };

  const questionTypes = [
    { type: "Aptitude", icon: Brain, color: "from-blue-500/10 to-cyan-500/10" },
    { type: "DSA", icon: Code2, color: "from-purple-500/10 to-pink-500/10" },
    { type: "Technical Interview", icon: Target, color: "from-green-500/10 to-emerald-500/10" },
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
            <Button variant="ghost" onClick={() => navigate("/programs")}>
              Programs
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-12 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Page Title */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-foreground tracking-tight">
            Student Portal
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-normal leading-relaxed">
            Access all your training and placement resources in one place
          </p>
        </div>

        {/* Training Resources Section */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-foreground">Training Resources</h2>
            <p className="text-muted-foreground">Essential templates and tools for your job search</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingResources.map((resource, index) => (
              <Card
                key={resource.id}
                onClick={() => window.open(resource.url, "_blank")}
                className={`border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl cursor-pointer group animate-fade-in animate-stagger-${(index % 6) + 1}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                      <resource.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {resource.name}
                    </CardTitle>
                  </div>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary/10 group-hover:border-primary transition-all">
                    Access Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Placement Resources Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-foreground">Placement Resources</h2>
            <p className="text-muted-foreground">Company-specific interview preparation materials</p>
          </div>

          {/* Company Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Select a Company</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {companies.map((company, index) => (
                <Card
                  key={company.name}
                  onClick={() => setSelectedCompany(company.name)}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg animate-fade-in animate-stagger-${(index % 6) + 1} ${
                    selectedCompany === company.name
                      ? "border-2 border-primary bg-primary/5"
                      : "border-2 border-border hover:border-primary/40"
                  }`}
                >
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="text-4xl mb-2">{company.logo}</div>
                    <p className="text-sm font-bold">{company.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Question Types */}
          {selectedCompany && (
            <div className="animate-scale-in">
              <h3 className="text-xl font-bold mb-6">
                {selectedCompany} - Interview Preparation
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {questionTypes.map((question, index) => (
                  <Card
                    key={question.type}
                    onClick={() => {
                      const url = companyResources[selectedCompany]?.[question.type];
                      if (url) window.open(url, "_blank");
                    }}
                    className={`border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl cursor-pointer group animate-fade-in animate-stagger-${index + 1}`}
                  >
                    <CardHeader className={`bg-gradient-to-br ${question.color} group-hover:opacity-80 transition-opacity`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-background rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                          <question.icon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                          {question.type}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        Prepare for {selectedCompany} {question.type.toLowerCase()} questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        View Questions
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!selectedCompany && (
            <div className="text-center py-16 bg-secondary/30 rounded-2xl border-2 border-dashed border-border">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                Select a company above to view interview preparation resources
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border">
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
                © 2026 UPSTRIDE Learning. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portal;
