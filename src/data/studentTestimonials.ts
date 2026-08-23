// Real student outcomes from the Upstrides cohorts — reused on the Courses
// page as social proof.

export interface StudentStory {
  name: string;
  image: string;
  achievement: string;
  quote: string;
  highlight: string;
}

export const STUDENT_STORIES: StudentStory[] = [
  {
    name: "SRI",
    image: "/sri-image.jpg",
    achievement: "From clueless to confident — built a project that changed everything",
    quote:
      "Before Mamlesh I knew nothing and had no direction. After joining I got clarity and gained real confidence. The project I built felt like my first step toward something bigger — and I felt that so hard.",
    highlight: "CLARITY GAINED",
  },
  {
    name: "NIVEDITHA",
    image: "/niveditha.jpg",
    achievement: "60-day live internship — now building in AI & participating in buildathons",
    quote:
      "I only knew concepts before. During the internship I worked on a live project and learned communication, interviews, and time management. My mindset shifted from just learning to actually building.",
    highlight: "INTERNSHIP DONE",
  },
  {
    name: "DIVYA",
    image: "/divya.jpg",
    achievement: "Placed in Central Government — AICTE",
    quote:
      "Landing a central government role straight out of college wasn't something I imagined. This helped me build the confidence and skills to actually get there.",
    highlight: "GOVT. PLACED",
  },
  {
    name: "ANMOL",
    image: "/anmol.jpg",
    achievement: "AIR 734 in GATE DA",
    quote:
      "Cracking GATE with a rank of 734 in Data Analytics took serious focus and the right guidance. Mamlesh helped me build that discipline.",
    highlight: "GATE AIR 734",
  },
  {
    name: "UWAIS",
    image: "/uwais.jpg",
    achievement: "Was clueless — now competing and winning hackathons",
    quote:
      "I had no idea what I was doing when I joined. Mamlesh gave me direction. Now I'm going to hackathons and actually winning them. The turnaround is real.",
    highlight: "HACKATHON WINNER",
  },
  {
    name: "VAMSI",
    image: "/vamsi-image.jpeg",
    achievement: "Summer internship at Accenture",
    quote:
      "Getting into Accenture as a summer intern felt like a big deal. The preparation and project work here made it possible.",
    highlight: "ACCENTURE INTERN",
  },
  {
    name: "RAJESH S",
    image: "/rajeshs.jpeg",
    achievement: "Placed at Altruist",
    quote:
      "Getting placed at Altruist was the goal. Mamlesh kept me focused, pushed me to build real things, and prepared me for how actual teams work.",
    highlight: "PLACED @ ALTRUIST",
  },
  {
    name: "KABIL",
    image: "/Kabil.jpeg",
    achievement: "Building his own startup",
    quote:
      "Most people talk about starting something. I'm actually doing it. Mamlesh taught me how to think like a founder, not just an engineer.",
    highlight: "BUILDING STARTUP",
  },
  {
    name: "PRANEETH S",
    image: "/praneeths.jpeg",
    achievement: "Placed to work on a funded project",
    quote:
      "Working on a funded project right out of college is something most students only dream about. Mamlesh helped me get there faster than I expected.",
    highlight: "FUNDED PROJECT",
  },
];

// Companies students have landed at.
export const PLACEMENT_COMPANIES: string[] = [
  "Accenture",
  "Altruist",
  "AICTE (Central Govt.)",
  "iNextLabs",
  "EMotorad",
  "Deepgram partners",
  "AI-Mond",
  "Floworx",
  "Digital Dost",
  "JakeBrake Logistics",
];
