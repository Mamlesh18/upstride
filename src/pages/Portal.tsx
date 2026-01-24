import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, Linkedin, ListChecks, FileCode, MessageSquare, Building2, Code2, LogOut, GraduationCap, Star, Database, Network, Cpu, MessageCircle, Lightbulb, Brain, Target, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ViewType = "recommended" | "training" | "placement";

const Portal = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>("recommended");
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

  // Categorized training resources
  const trainingResourcesCategories = [
    {
      category: "Learning Materials",
      color: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      icon: BookOpen,
      description: "Comprehensive learning resources for AI, Frontend, and Backend development",
      resources: [
        { id: 0, name: "AI Training Resource", icon: Brain, description: "Complete guide for learning Artificial Intelligence fundamentals and advanced concepts", url: "https://docs.google.com/document/d/1fZ6b1J3e2mkN954eCgf8G4g6RO_XVCO0FJEJPecNtDc/edit?usp=sharing" },
        { id: -1, name: "ReactJS Frontend", icon: Code2, description: "Comprehensive frontend development training with React, modern UI/UX practices", url: "https://docs.google.com/document/d/1Ez1sA7_r42u1MskH-CuuhbrnucboCS8TNrrXXpQSWYo/edit?usp=sharing" },
        { id: -2, name: "Python Backend", icon: FileText, description: "Backend development with Python, APIs, databases, and server-side programming", url: "https://docs.google.com/document/d/1GCNXcPpThwiQ70Ad1Y6awnBQe5Bct5VvcIwJNi2sGpc/edit?usp=sharing" },
      ]
    },
    {
      category: "Resume & Career Documents",
      color: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
      icon: FileText,
      description: "Build professional resumes and cover letters that get noticed by recruiters",
      resources: [
        { id: 1, name: "Resume AI Builder", icon: FileCode, description: "AI-powered resume builder", url: "https://docs.google.com/document/d/15lwb2eYty-uf1Y8VRrl19CLPljPAdqbf/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true" },
        { id: 2, name: "Resume Review", icon: FileText, description: "Get your resume reviewed by experts", url: "https://docs.google.com/document/d/16yLxoy-qZUZ9SRrqJQeL_tVqy4bc5liA39R9T8yyrSs/edit?usp=sharing" },
        { id: 3, name: "Cover Letter Templates", icon: FileText, description: "Professional cover letter templates", url: "https://docs.google.com/document/d/11P_LLTpx16Z83EW8u_YVY9l05x7SKU950PTWJQuzJhQ/edit?usp=sharing" },
      ]
    },
    {
      category: "Networking & Outreach",
      color: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      icon: Linkedin,
      description: "Master LinkedIn optimization and professional networking strategies",
      resources: [
        { id: 4, name: "LinkedIn Profile Review", icon: Linkedin, description: "Get your LinkedIn profile reviewed", url: "https://docs.google.com/document/d/1ZUQvHMoMxXjm-G1uGGkQZ1YNj5VNndU5LgE3cfu8IsE/edit?usp=sharing" },
        { id: 5, name: "LinkedIn Message Templates", icon: Linkedin, description: "Message templates for HR outreach", url: "https://docs.google.com/document/d/1KXw6R6RgB_37-3JiQnB9DleoAlMJJTZObIP3M96BqTo/edit?usp=sharing" },
        { id: 6, name: "Email To Send To HR", icon: Mail, description: "Professional email templates", url: "https://docs.google.com/document/d/1CSSgkt1qBU9oSXSKALrpy_89MfmkZvJ7vr4z9FRr1uE/edit?usp=sharing" },
        { id: 7, name: "Company Contact Database", icon: ListChecks, description: "List of company HR contacts", url: "https://docs.google.com/document/d/1qTrPuIWZPXmOcKW2qmNbzyqgUqvamy1t7OXgVeS_FPw/edit?usp=sharing" },
      ]
    },
    {
      category: "Interview Preparation",
      color: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20",
      icon: MessageCircle,
      description: "Ace your interviews with mock sessions and DSA practice",
      resources: [
        { id: 8, name: "Mock Interview Guide", icon: MessageCircle, description: "Complete mock interview preparation", url: "https://docs.google.com/document/d/1cXm9ZWtKWuy9iIHtCr6595YxJhQVLPYqNY_aSBsF_ZI/edit?usp=sharing" },
        { id: 9, name: "Most Asked DSA Questions", icon: Code2, description: "Top DSA interview questions", url: "https://docs.google.com/document/d/1UUfEZWFUJw3GihrBcSjdKlAXHAklg7fd9qnvrh45Dc0/edit?usp=sharing" },
      ]
    },
    {
      category: "Technical Interview Questions",
      color: "from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-500/20",
      icon: Code2,
      description: "Comprehensive question banks for all major technical topics",
      resources: [
        { id: 10, name: "React Interview Questions", icon: Code2, description: "React concepts and answers", url: "https://docs.google.com/document/d/1WO82ZMmdhhwWuiG0WzVtKz42J4i1gla_NejVFEQmEUw/edit?usp=sharing" },
        { id: 11, name: "Python Interview Questions", icon: Code2, description: "Python interview essentials", url: "https://docs.google.com/document/d/1suRsDJ1fj-ZLVMjGlGCwGpRgOLp0zpWy2CKpuBmIKmc/edit?usp=sharing" },
        { id: 12, name: "Database Interview", icon: Database, description: "SQL and database concepts", url: "https://docs.google.com/document/d/1eEXBhg2QRnFa2r_x9d-C1LmvEyXMLZOfg9DfEo6QnDU/edit?usp=sharing" },
        { id: 13, name: "Operating System", icon: Cpu, description: "OS concepts and questions", url: "https://docs.google.com/document/d/1IxAzP-yStZeFMU7wDA6cMicg3sOj9G0R5_soiLeD09Q/edit?usp=sharing" },
        { id: 14, name: "Computer Networks", icon: Network, description: "Networking fundamentals", url: "https://docs.google.com/document/d/1Yz5EvTOL-UqQ61vSXSfLnB53RquAmvD037RxkDhtgvU/edit?usp=sharing" },
        { id: 15, name: "LLM Interview Questions", icon: MessageSquare, description: "AI/ML interview preparation", url: "https://docs.google.com/document/d/1J7L8THutNBC7iapuyiTw9hfIYsO_-U5FxWgt-lVZFvM/edit?usp=sharing" },
      ]
    },
    {
      category: "Projects & Portfolio",
      color: "from-indigo-500/10 to-violet-500/10",
      borderColor: "border-indigo-500/20",
      icon: Lightbulb,
      description: "Build impressive projects to showcase on your resume",
      resources: [
        { id: 16, name: "AI Project Ideas", icon: Lightbulb, description: "Innovative AI project ideas", url: "https://docs.google.com/document/d/1og-faGxKFLwMvjln6vmMfIInnMjtAYGbe4l21euevII/edit?usp=sharing" },
      ]
    },
  ];

  // Companies with multiple resources (3 docs each)
  const companiesWithMultipleResources = [
    { name: "Accenture", logo: "🏢" },
    { name: "Cognizant", logo: "🏢" },
    { name: "HCL", logo: "🏢" },
    { name: "Infosys", logo: "🏢" },
    { name: "L&T", logo: "🏢" },
    { name: "TCS", logo: "🏢" },
    { name: "Wipro", logo: "🏢" },
    { name: "Zoho", logo: "🏢" },
  ];

  // Company resources with 3 documents each (Aptitude, DSA, Technical)
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

  // Companies with single resource document
  const companiesWithSingleResource = [
    { name: "Zomato", logo: "🍔", url: "https://docs.google.com/document/d/1W0WvDBPA9tV6n6MsnlSFbUVA6ZIwoJSEtIb7hvw1qY8/edit?usp=sharing" },
    { name: "Zepto", logo: "⚡", url: "https://docs.google.com/document/d/1P-lmy49E2sgN77ew01vDVaG5l3AKr09iY9yaqAzVowM/edit?usp=sharing" },
    { name: "EY", logo: "💼", url: "https://docs.google.com/document/d/1StJiYnwDRwIN6EytvUSwwZ9hz_g2LnkCFu1qpiYydgE/edit?usp=sharing" },
    { name: "Deloitte", logo: "💼", url: "https://docs.google.com/document/d/13U9LbgL8ugyFjorayU5eWVJqg1r1HG1Jj5E1dUNMcIg/edit?usp=sharing" },
    { name: "Capgemini", logo: "💼", url: "https://docs.google.com/document/d/1AJW_lvHHQPojcIJUOHML7W4GM_0-Qteu1M3qdA3o0ro/edit?usp=sharing" },
    { name: "Swiggy", logo: "🍕", url: "https://docs.google.com/document/d/14UES14KDHfTnYiVlQieGJw2hE8HjdzqGFWgo-bqDsSA/edit?usp=sharing" },
    { name: "Google", logo: "🔍", url: "" },
    { name: "Amazon", logo: "📦", url: "" },
    { name: "Microsoft", logo: "🪟", url: "" },
  ];

  // All companies combined for display
  const allCompanies = [...companiesWithMultipleResources, ...companiesWithSingleResource];

  const questionTypes = [
    { type: "Aptitude", icon: Brain, color: "from-blue-500/10 to-cyan-500/10" },
    { type: "DSA", icon: Code2, color: "from-purple-500/10 to-pink-500/10" },
    { type: "Technical Interview", icon: Target, color: "from-green-500/10 to-emerald-500/10" },
  ];

  // Recommended docs - curated list shown by default
  const recommendedDocs = [
    { id: 1, name: "Most Asked DSA Questions", icon: Code2, description: "Essential DSA questions for interviews", url: "https://docs.google.com/document/d/1UUfEZWFUJw3GihrBcSjdKlAXHAklg7fd9qnvrh45Dc0/edit?usp=sharing", category: "Technical" },
    { id: 2, name: "Resume AI Builder", icon: FileCode, description: "Create your professional resume", url: "https://docs.google.com/document/d/15lwb2eYty-uf1Y8VRrl19CLPljPAdqbf/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true", category: "Career" },
    { id: 3, name: "React Interview Questions", icon: Code2, description: "Master React for interviews", url: "https://docs.google.com/document/d/1WO82ZMmdhhwWuiG0WzVtKz42J4i1gla_NejVFEQmEUw/edit?usp=sharing", category: "Technical" },
    { id: 4, name: "Mock Interview Guide", icon: MessageCircle, description: "Prepare for mock interviews", url: "https://docs.google.com/document/d/1cXm9ZWtKWuy9iIHtCr6595YxJhQVLPYqNY_aSBsF_ZI/edit?usp=sharing", category: "Interview" },
    { id: 5, name: "Database Interview", icon: Database, description: "Database concepts and questions", url: "https://docs.google.com/document/d/1eEXBhg2QRnFa2r_x9d-C1LmvEyXMLZOfg9DfEo6QnDU/edit?usp=sharing", category: "Technical" },
    { id: 6, name: "TCS Interview Prep", icon: Building2, description: "Complete TCS preparation", url: "https://docs.google.com/document/d/1zHWsyH_0MiEjgmvbq5tMc6shIyI_c_XEKokLY5CQwMQ/edit?usp=sharing", category: "Company" },
    { id: 7, name: "Python Interview Questions", icon: Code2, description: "Python interview essentials", url: "https://docs.google.com/document/d/1suRsDJ1fj-ZLVMjGlGCwGpRgOLp0zpWy2CKpuBmIKmc/edit?usp=sharing", category: "Technical" },
    { id: 8, name: "LinkedIn Message Templates", icon: Linkedin, description: "Reach out to HR effectively", url: "https://docs.google.com/document/d/1KXw6R6RgB_37-3JiQnB9DleoAlMJJTZObIP3M96BqTo/edit?usp=sharing", category: "Career" },
    { id: 9, name: "AI Project Ideas", icon: Lightbulb, description: "Build impressive AI projects", url: "https://docs.google.com/document/d/1og-faGxKFLwMvjln6vmMfIInnMjtAYGbe4l21euevII/edit?usp=sharing", category: "Technical" },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technical: "from-blue-500/10 to-cyan-500/10",
      Career: "from-green-500/10 to-emerald-500/10",
      Interview: "from-purple-500/10 to-pink-500/10",
      Company: "from-orange-500/10 to-red-500/10",
    };
    return colors[category] || "from-gray-500/10 to-slate-500/10";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative Elements */}
      <div className="fixed top-4 right-4 z-30 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-80 blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-primary opacity-60 blur-lg animate-float"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full backdrop-blur-sm z-40 border-b border-border/20">
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

      {/* Main Layout with Sidebar */}
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-background border-r border-border/50 overflow-y-auto">
          <div className="p-4 space-y-2">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Navigation</h2>

            <Button
              variant={currentView === "recommended" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentView("recommended")}
            >
              <Star className="w-4 h-4 mr-2" />
              Recommended Docs
            </Button>

            <Button
              variant={currentView === "training" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentView("training")}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Training Resources
            </Button>

            <Button
              variant={currentView === "placement" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentView("placement")}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Placement Resources
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="p-4 mt-8 border-t border-border/50">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Training Resources</span>
                <span className="font-bold text-primary">{trainingResourcesCategories.reduce((acc, cat) => acc + cat.resources.length, 0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Companies</span>
                <span className="font-bold text-primary">{allCompanies.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recommended</span>
                <span className="font-bold text-primary">{recommendedDocs.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="ml-64 flex-1 p-8 min-h-screen">
          {/* Recommended Docs View */}
          {currentView === "recommended" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black mb-3 text-foreground">Recommended for You</h1>
                <p className="text-muted-foreground text-lg">Handpicked resources to kickstart your preparation</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedDocs.map((doc, index) => (
                  <Card
                    key={doc.id}
                    onClick={() => window.open(doc.url, "_blank")}
                    className={`border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl cursor-pointer group animate-fade-in animate-stagger-${(index % 6) + 1}`}
                  >
                    <CardHeader className={`bg-gradient-to-br ${getCategoryColor(doc.category)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-background rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                            <doc.icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-primary/20 text-primary rounded-full">
                          {doc.category}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {doc.name}
                      </CardTitle>
                      <CardDescription>{doc.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                        Open Document
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Training Resources View */}
          {currentView === "training" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black mb-3 text-foreground">Training Resources</h1>
                <p className="text-muted-foreground text-lg">Essential templates and tools for your job search journey</p>
              </div>

              {trainingResourcesCategories.map((category, catIndex) => (
                <div key={catIndex} className="mb-12">
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${category.color} rounded-xl p-6 mb-6 border-2 ${category.borderColor}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-background/50 rounded-lg">
                        <category.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{category.category}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>

                  {/* Category Resources Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.resources.map((resource, index) => (
                      <Card
                        key={index}
                        onClick={() => window.open(resource.url, "_blank")}
                        className={`border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl cursor-pointer group animate-fade-in animate-stagger-${(index % 6) + 1}`}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-3 bg-gradient-to-br ${category.color} rounded-xl group-hover:scale-110 transition-transform`}>
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
                </div>
              ))}
            </div>
          )}

          {/* Placement Resources View */}
          {currentView === "placement" && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black mb-3 text-foreground">Placement Resources</h1>
                <p className="text-muted-foreground text-lg">Company-specific interview preparation materials</p>
              </div>

              {/* Companies with Multiple Resources */}
              <div className="mb-12">
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 mb-6 border-2 border-blue-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Service-Based IT Companies</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">These companies focus on providing IT services, consulting, and outsourcing. They typically hire in large numbers and have structured interview processes with Aptitude, DSA, and Technical rounds.</p>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-6">📋 Click on any company below to access all 3 preparation resources</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {companiesWithMultipleResources.map((company, index) => (
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

                {/* Question Types for Selected Company */}
                {selectedCompany && companyResources[selectedCompany] && (
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
                  <div className="text-center py-12 bg-secondary/30 rounded-2xl border-2 border-dashed border-border">
                    <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      Select a company above to view interview preparation resources
                    </p>
                  </div>
                )}
              </div>

              {/* Companies with Single Resource */}
              <div>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 mb-6 border-2 border-purple-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Product-Based & Startup Companies</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">These companies build their own products and platforms. They focus on innovation, problem-solving, and typically have rigorous technical interviews emphasizing data structures, algorithms, and system design.</p>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-6">🚀 Click on any company to access comprehensive interview preparation</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {companiesWithSingleResource.map((company, index) => (
                    <Card
                      key={company.name}
                      onClick={() => {
                        if (company.url) {
                          window.open(company.url, "_blank");
                        } else {
                          toast({
                            title: "Coming Soon",
                            description: `${company.name} resources will be available soon`,
                          });
                        }
                      }}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/40 border-2 border-border group animate-fade-in animate-stagger-${(index % 6) + 1}`}
                    >
                      <CardContent className="pt-6 pb-6 text-center">
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{company.logo}</div>
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{company.name}</p>
                        {!company.url && (
                          <p className="text-xs text-muted-foreground mt-1">Coming Soon</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Portal;
