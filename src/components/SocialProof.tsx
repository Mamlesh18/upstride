import { useState, useEffect } from "react";
import { Users } from "lucide-react";

// Helper to get today's date as a string (YYYY-MM-DD)
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper to get or generate daily count
const getDailyCount = () => {
  const storedData = localStorage.getItem('upstride_joined_count');

  if (storedData) {
    const { date, count } = JSON.parse(storedData);
    // If it's still the same day, return the stored count
    if (date === getTodayDate()) {
      return count;
    }
  }

  // Generate new count for today (6-15)
  const newCount = Math.floor(Math.random() * 10) + 6;
  localStorage.setItem('upstride_joined_count', JSON.stringify({
    date: getTodayDate(),
    count: newCount
  }));

  return newCount;
};

const SocialProof = () => {
  // Get the daily count (same for entire day)
  const [joinedCount, setJoinedCount] = useState(6);

  // Initialize count on mount
  useEffect(() => {
    setJoinedCount(getDailyCount());
  }, []);

  return (
    <div className="fixed top-24 right-6 z-40 hidden md:block">
      <div className="bg-background/90 backdrop-blur-md border-2 border-border rounded-xl shadow-lg p-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-foreground text-lg">{joinedCount}</span>
            <span className="text-muted-foreground text-sm ml-1">people</span>
            <p className="text-muted-foreground text-xs">joined the course in past week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
