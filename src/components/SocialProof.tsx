import { useState, useEffect } from "react";
import { X, Eye, CheckCircle, Briefcase, TrendingUp, Users } from "lucide-react";

// Realistic mock data
const indianNames = [
  "Rahul", "Priya", "Amit", "Sneha", "Vikram", "Ananya", "Arjun", "Pooja",
  "Rohan", "Divya", "Karan", "Isha", "Aditya", "Neha", "Siddharth", "Kavya",
  "Varun", "Riya", "Akash", "Shreya", "Nikhil", "Tanvi", "Pranav", "Meera"
];

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Indore", "Kochi", "Nagpur"
];

// Only one program - Experience Selling Bootcamp
const mainProgram = "Experience Selling Bootcamp";

const companies = [
  "TCS", "Infosys", "Wipro", "Cognizant", "Accenture", "HCL", "Tech Mahindra",
  "Zoho", "Flipkart", "Amazon", "Google", "Microsoft", "Zomato", "Swiggy",
  "Capgemini", "Deloitte", "EY", "Paytm", "PhonePe"
];

type NotificationType = "view" | "enrollment" | "internship" | "stats" | "achievement";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

const SocialProof = () => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Stats that update every 12 hours
  const [stats, setStats] = useState({
    onlineStudents: Math.floor(Math.random() * 30) + 85, // 85-115
    viewsToday: Math.floor(Math.random() * 5) + 17, // 17-22
    joinedThisWeek: Math.floor(Math.random() * 3) + 3, // 3-6
  });

  // Update stats every 12 hours
  useEffect(() => {
    const updateStats = () => {
      setStats({
        onlineStudents: Math.floor(Math.random() * 30) + 85, // 85-115
        viewsToday: Math.floor(Math.random() * 5) + 17, // 17-22
        joinedThisWeek: Math.floor(Math.random() * 3) + 3, // 3-6
      });
    };

    // Update stats every 12 hours (43200000 ms)
    const statsInterval = setInterval(updateStats, 12 * 60 * 60 * 1000);

    return () => clearInterval(statsInterval);
  }, []);

  // Generate random notification
  const generateNotification = (): Notification => {
    const name = indianNames[Math.floor(Math.random() * indianNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const minutesAgo = Math.floor(Math.random() * 45) + 1;

    const notificationTypes: NotificationType[] = ["view", "enrollment", "internship", "stats", "achievement"];
    const weights = [0.3, 0.25, 0.2, 0.15, 0.1]; // Probability weights

    let random = Math.random();
    let type: NotificationType = "view";
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        type = notificationTypes[i];
        break;
      }
    }

    const id = `${Date.now()}-${Math.random()}`;
    let message = "";
    let icon: React.ReactNode;
    let color = "";

    switch (type) {
      case "view":
        message = `${name} is viewing ${mainProgram}`;
        icon = <Eye className="w-5 h-5" />;
        color = "from-blue-500 to-cyan-500";
        break;

      case "enrollment":
        message = `${name} from ${city} just enrolled in ${mainProgram}`;
        icon = <CheckCircle className="w-5 h-5" />;
        color = "from-green-500 to-emerald-500";
        break;

      case "internship":
        message = `${name} got an internship at ${company} through UPSTRIDE!`;
        icon = <Briefcase className="w-5 h-5" />;
        color = "from-purple-500 to-pink-500";
        break;

      case "stats":
        const todayViews = Math.floor(Math.random() * 10) + 15; // 15-25
        const enrollments = Math.floor(Math.random() * 5) + 2; // 2-7
        const statsType = Math.random() > 0.5 ? "views" : "enrollments";

        if (statsType === "views") {
          message = `${todayViews} people viewed the program today`;
        } else {
          message = `${enrollments} students enrolled this week`;
        }
        icon = <TrendingUp className="w-5 h-5" />;
        color = "from-orange-500 to-red-500";
        break;

      case "achievement":
        const achievements = [
          `${name} completed ${mainProgram} with 95% score`,
          `${name} built impressive portfolio through ${mainProgram}`,
          `${name} received job offer from ${company}`,
          `20+ students placed this month`,
          `${name} got promoted after ${mainProgram}`
        ];
        message = achievements[Math.floor(Math.random() * achievements.length)];
        icon = <Users className="w-5 h-5" />;
        color = "from-indigo-500 to-blue-500";
        break;
    }

    return {
      id,
      type,
      message,
      timestamp: minutesAgo === 1 ? "1 minute ago" : `${minutesAgo} minutes ago`,
      icon,
      color
    };
  };

  useEffect(() => {
    if (isPaused) return;

    let timeoutId: NodeJS.Timeout;

    const showNotification = () => {
      const notification = generateNotification();
      setCurrentNotification(notification);
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      // Schedule next notification after random 1-2 minutes
      if (!isPaused) {
        const nextDelay = Math.random() * 60000 + 60000; // 1-2 minutes
        timeoutId = setTimeout(showNotification, nextDelay);
      }
    };

    // Show first notification immediately on page load
    showNotification();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isPaused]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {/* Main Notification Popup - Only show when there's a notification */}
      {currentNotification && (
        <div
          className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ease-out ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 pointer-events-none"
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-background border-2 border-border rounded-xl shadow-2xl p-4 pr-12 max-w-sm hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`p-2 rounded-lg bg-gradient-to-br ${currentNotification.color} text-white flex-shrink-0 animate-pulse`}
              >
                {currentNotification.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {currentNotification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentNotification.timestamp}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* UPSTRIDE Branding */}
            <div className="mt-2 pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="font-bold text-primary">UPSTRIDE</span>
                <span>• Real-time activity</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Stats Widget - Top Right */}
      <div className="fixed top-24 right-6 z-40 hidden md:block">
        <div className="bg-background/90 backdrop-blur-md border-2 border-border rounded-xl shadow-lg p-3 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">
              {stats.onlineStudents}
            </span>
            <span className="text-muted-foreground text-xs">students online</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="font-bold text-foreground">
              {stats.viewsToday}
            </span>
            <span className="text-muted-foreground text-xs">viewed today</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-foreground">
              {stats.joinedThisWeek}
            </span>
            <span className="text-muted-foreground text-xs">joined this week</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialProof;
