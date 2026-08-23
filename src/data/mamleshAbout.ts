export const GALLERY = [
  { src: "/graduation.jpeg", caption: "Graduation day" },
  { src: "/college.jpeg", caption: "College days" },
  { src: "/office.jpeg", caption: "At iNextLabs" },
  { src: "/students.jpeg", caption: "With the students I mentor" },
  { src: "/award.jpeg", caption: "An award along the way" },
  { src: "/reels.jpeg", caption: "Sharing on socials" },
];

export const HIGHLIGHTS = [
  { n: "10", l: "Internships" },
  { n: "4", l: "Research papers" },
  { n: "2", l: "Patents" },
  { n: "8+", l: "Guest talks" },
  { n: "1000+", l: "Students mentored" },
  { n: "13k+", l: "LinkedIn followers" },
];

export const ABOUT_INTRO = [
  "I build voice and applied-AI systems for a living, and I have spent the last few years going deep - from autonomous rovers and edge security to multi-agent systems and real-time voice agents. Currently I lead voice agent development at iNextLabs, shipping AI that businesses actually run their call workflows on.",
  "Along the way I have done 10 internships across India, Singapore, and the US, published 4 research papers, been granted 2 patents, and raised 50L as a founding AI engineer. I mentor at Infosys Springboard, have spoken at 8+ colleges as a guest speaker, and have guided over 1000 students into AI.",
  "I learn in public and teach what I know - because the fastest way to grow is to build real things and share the playbook.",
];

export interface Role {
  role: string;
  org: string;
  url?: string;
  type: string;
  period: string;
  location: string;
  points: string[];
  skills: string[];
}

export const ROLES: Role[] = [
  {
    role: "Lead Voice Agent Developer",
    org: "iNextLabs",
    url: "https://www.inextlabs.ai",
    type: "Full-time",
    period: "2025 - Present",
    location: "Remote",
    points: [
      "Lead the design and delivery of production voice agents that streamline business call workflows.",
      "Own the Deepgram partnership and the end-to-end STT/TTS + RAG + LLM voice stack.",
    ],
    skills: ["Voice AI", "LLMs", "RAG"],
  },
  {
    role: "AI Engineer Intern",
    org: "iNextLabs",
    url: "https://www.inextlabs.ai",
    type: "Internship",
    period: "Feb 2025 - May 2025",
    location: "Remote",
    points: [
      "Built a demo combining Deepgram STT/TTS with a custom RAG pipeline, LLM integration, DTMF handling, and an interrupt handler.",
      "Fine-tuned Whisper (Turbo) locally with OpenAI, Google Translate, and Streamlit for real-time multilingual speech recognition.",
      "Built a Text-to-SQL system with LangChain, SQLDatabaseToolkit, and OpenAI to generate queries from natural language.",
      "Shipped a voice assistant with sub-1-second transcription latency.",
    ],
    skills: ["LLMs", "LangChain", "Deepgram"],
  },
  {
    role: "Founding AI Engineer",
    org: "AI-Mond",
    type: "Full-time",
    period: "Feb 2025 - May 2025",
    location: "Mumbai · Remote",
    points: [
      "Wrote a 7-agent multi-agent system (A2A-enabled) wired to 52 tools.",
      "Built 10+ production-grade REST endpoints.",
      "Refactored 20,000+ lines of code.",
    ],
    skills: ["Multi-Agent", "Agents", "Backend"],
  },
  {
    role: "Back End & Cloud Developer Intern",
    org: "EMotorad",
    type: "Internship",
    period: "Nov 2024 - Jan 2025",
    location: "Bengaluru · On-site",
    points: [
      "Built custom API-gateway plugins in Go to boost system performance.",
      "Developed an SSE service streaming data to the internal dashboard every 2 seconds.",
      "Built gRPC pod-to-pod communication within a cluster.",
      "Worked with Terraform, Kubernetes, Ingress, PostgreSQL, Prometheus, Grafana, Kafka, and Flink.",
    ],
    skills: ["Go", "Kubernetes", "gRPC"],
  },
  {
    role: "AI Engineer Intern",
    org: "iNextLabs",
    url: "https://www.inextlabs.ai",
    type: "Internship",
    period: "Oct 2024 - Nov 2024",
    location: "Singapore · Remote",
    points: [
      "Built a PDF-to-JSON extraction tool using the Adobe API.",
      "Created a table-to-text algorithm pipelined to OpenAI for meaningful sentence generation.",
      "Built a knowledge base using Crawl4AI, FAISS, LangChain, OpenAI, and Azure.",
    ],
    skills: ["Azure", "LangChain", "Agile"],
  },
  {
    role: "Apprentice",
    org: "IEEE India Council",
    type: "Apprenticeship",
    period: "Sep 2024 - Dec 2024",
    location: "Remote",
    points: [
      "Gained an in-depth understanding of the software industry and expanded my network.",
      "Found a lifelong mentor.",
    ],
    skills: ["Community"],
  },
  {
    role: "Full Stack Developer Intern",
    org: "JakeBrake Logistics LLC",
    type: "Internship",
    period: "Aug 2024 - Sep 2024",
    location: "United States · Remote",
    points: [
      "Built backend applications and automated API workflows.",
      "Scraped data and exposed APIs to post it back to the website.",
    ],
    skills: ["Flask", "React"],
  },
  {
    role: "AI Engineer Fellow",
    org: "Headstarter AI",
    type: "Apprenticeship",
    period: "Jul 2024 - Sep 2024",
    location: "San Francisco Bay Area · Remote",
    points: [
      "Shipped 5 AI projects and competed in hackathons.",
      "Built leadership, confidence, and a stronger network.",
    ],
    skills: ["AI", "Hackathons"],
  },
  {
    role: "Web Development Intern",
    org: "Digital Dost",
    type: "Internship",
    period: "Aug 2024",
    location: "Remote",
    points: [
      "Built and deployed front-end websites with Vite, React, and Tailwind CSS.",
      "Worked professionally with Slack, Trello, and BitBucket.",
    ],
    skills: ["Vite", "React", "Tailwind"],
  },
  {
    role: "Software Developer Intern",
    org: "Floworx",
    type: "Internship",
    period: "Jun 2024 - Jul 2024",
    location: "Bengaluru · Remote",
    points: [
      "Built a job-seeking portal with a React frontend, Python backend, and MongoDB.",
      "Implemented automated candidate emails over SMTP and custom MongoDB search filters.",
    ],
    skills: ["React", "MongoDB", "Python"],
  },
  {
    role: "Teaching Assistant",
    org: "Coding Ninjas",
    type: "Part-time",
    period: "Nov 2023 - Feb 2024",
    location: "Remote",
    points: [
      "Guided students through a Data Science and Machine Learning course.",
      "Mentored 150+ students and evaluated their AI/ML projects.",
    ],
    skills: ["Python", "Mentoring"],
  },
  {
    role: "AI Research Intern",
    org: "TiHAN - IIT Hyderabad",
    type: "Internship",
    period: "Aug 2023 - Jan 2024",
    location: "On-site",
    points: [
      "Developed algorithms for autonomous and visual navigation systems.",
      "Built a YOLOv8 sugarcane-detection model on a custom dataset collected by hand.",
      "Streamed multiple cameras to a single server via socket programming.",
      "Published a patent on an autonomous rover and contributed to an IEEE paper (BITS Dubai).",
    ],
    skills: ["Deep Learning", "YOLOv8", "Robotics"],
  },
  {
    role: "AI Engineer Intern",
    org: "TekCogent Solutions",
    type: "Internship",
    period: "Nov 2023 - Dec 2023",
    location: "Chennai · Hybrid",
    points: [
      "Configured a Jetson Nano for customised person-movement analysis using DeepStream.",
      "Built a custom YOLOv8 model and optimised its weights with TensorRT for faster inference.",
    ],
    skills: ["NVIDIA", "Deep Learning", "TensorRT"],
  },
];

export const PUBLICATIONS = [
  {
    title:
      "Adaptive Candidate Scoring and Feedback Integration (ACS-FI): Enhancing Recruiter Decision-Making",
    venue: "Taylor & Francis",
    date: "Apr 2025",
    link: "https://www.taylorfrancis.com/chapters/edit/10.1201/9781003650010-91/adaptive-candidate-scoring-feedback-integration-acs-fi-enhancing-recruiter-decision-making-karthikeyan-mamlesh-sahithi-venkata-pokuri-sruthi-sree-samiksha-racha-karishma",
    summary:
      "An ensemble-learning model (Logistic Regression, Decision Trees, Random Forest, SVM, K-NN) that scores candidates and continuously improves through recruiter feedback to make hiring fairer and more accurate.",
  },
  {
    title:
      "Intelligent Driver Guidance Dashboard Framework to Prevent Road Accidents in Poor Visibility Conditions",
    venue: "IEEE",
    date: "Feb 2025",
    link: "https://ieeexplore.ieee.org/document/10864452",
    summary:
      "A driver-assistance framework that improves safety and decision-making in low-visibility driving conditions.",
  },
  {
    title: "Server-Assisted Security Model for Edge Computing: A Packet Tracking Approach",
    venue: "IJRASET",
    date: "Jun 2024",
    link: "https://www.ijraset.com/research-paper/server-assisted-security-model-for-edge-computing",
    summary:
      "A prototype that connects edge devices to a main server over sockets so threats detected at the edge can alert the server in real time.",
  },
  {
    title:
      "A Review of Intel RealSense-Based Obstacle Detection for Unmanned Ground Vehicles",
    venue: "IJRASET",
    date: "Feb 2024",
    link: "https://www.ijraset.com/best-journal/a--review-of-intel-real-sense-based-obstacle-detection-for-unmanned-ground-vehicles",
    summary:
      "A review of obstacle-detection approaches for unmanned ground vehicles using Intel RealSense depth sensing.",
  },
];

export const PATENT_PORTAL =
  "https://iprsearch.ipindia.gov.in/PublicSearch/PublicationSearch/ApplicationStatus";

export const PATENTS = [
  {
    title: "Autonomous Navigation System for Ground-Based Monitoring of an Area",
    number: "202541007836",
    status: "Issued · Jan 30, 2025",
    summary:
      "A system for autonomously navigating and monitoring fields - built for under-canopy sugarcane environments where manual inspection is dangerous and difficult.",
  },
  {
    title:
      "Scalable Text Processing and API Integration Framework for Efficient Information Retrieval",
    number: "202541118355",
    status: "Issued · Dec 27, 2025",
    summary:
      "A flexible framework combining web crawling, vector indexing, and API integration to build custom knowledge bases across diverse domains.",
  },
];

export const VENTURES = [
  {
    title: "Founding AI Engineer - Stravah",
    detail:
      "Joined as a founding AI engineer and helped raise ₹50 lakh, building the early AI product and engineering foundation from zero to one.",
  },
  {
    title: "Funded Research - Autonomous Ground Rovers",
    detail:
      "Worked on Unmanned Ground Rovers (UGRs) - mobile robots that operate autonomously for ground monitoring - on a project that secured ₹30 lakh in funding.",
  },
  {
    title: "Mentor - Infosys Springboard",
    detail:
      "Mentor learners on Infosys Springboard, guiding them through AI and engineering fundamentals.",
  },
];
