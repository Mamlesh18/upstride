import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Calendar, BookOpen } from "lucide-react";
import { useState } from "react";

interface Module {
  week: number;
  title: string;
  topics: string[];
}

interface CourseInfo {
  name: string;
  description: string;
  duration: string;
  level: string;
  modules: Module[];
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  const courseData: Record<string, CourseInfo> = {
    python: {
      name: "Fundamentals of Python",
      description: "Master Python programming from basics to advanced concepts. Learn industry-standard practices and build real-world projects suitable for college and career advancement.",
      duration: "8 weeks (2 months)",
      level: "Beginner to Intermediate",
      modules: [
        {
          week: 1,
          title: "Python Basics & Environment Setup",
          topics: [
            "Why Python? Industry relevance and use cases",
            "Installation and IDE setup (VS Code, PyCharm)",
            "Python syntax, data types (int, float, string, bool)",
            "Variables, operators, and basic I/O",
            "Interactive Python shell and first programs",
            "Comments, naming conventions, and PEP 8 standards"
          ]
        },
        {
          week: 2,
          title: "Control Flow & Decision Making",
          topics: [
            "If-elif-else statements and logical operators",
            "Comparison operators and truth values",
            "Code blocks and indentation",
            "Loop types: for, while, nested loops",
            "Break, continue, and pass statements",
            "Problem-solving with conditional logic"
          ]
        },
        {
          week: 3,
          title: "Data Structures & DSA Fundamentals",
          topics: [
            "Lists: creation, indexing, slicing, operations",
            "Tuples, sets, and dictionaries",
            "List comprehensions",
            "Iterating over collections",
            "Basic algorithm analysis (Big O notation)",
            "Common data structure operations and complexity"
          ]
        },
        {
          week: 4,
          title: "Functions & Modular Programming",
          topics: [
            "Function definition, parameters, and return values",
            "Default arguments, *args, **kwargs",
            "Variable scope: local, global, nonlocal",
            "Lambda functions and higher-order functions",
            "Recursion and stack overflow concepts",
            "Code organization and module imports"
          ]
        },
        {
          week: 5,
          title: "Object-Oriented Programming (OOP)",
          topics: [
            "Classes and objects fundamentals",
            "Instance and class attributes",
            "Methods: instance, class, and static",
            "Inheritance and method overriding",
            "Polymorphism and abstraction",
            "Encapsulation and access modifiers",
            "Dunder methods (__init__, __str__, etc.)"
          ]
        },
        {
          week: 6,
          title: "File Handling & Error Management",
          topics: [
            "File operations: read, write, append",
            "Context managers (with statement)",
            "CSV and JSON file handling",
            "Exception handling: try-except-finally",
            "Custom exceptions",
            "Debugging techniques and logging"
          ]
        },
        {
          week: 7,
          title: "Libraries & External Modules",
          topics: [
            "NumPy for numerical computing",
            "Pandas for data manipulation",
            "Working with packages and pip",
            "Common libraries: datetime, collections, itertools",
            "Matplotlib basics for visualization",
            "Regular expressions (regex)"
          ]
        },
        {
          week: 8,
          title: "Capstone Project & Best Practices",
          topics: [
            "Building a complete project (e.g., Student Management System)",
            "Testing: unit tests and pytest",
            "Version control with Git",
            "Code documentation and docstrings",
            "Performance optimization and profiling",
            "Interview preparation and assessment"
          ]
        }
      ]
    },
    fullstack: {
      name: "Fullstack Web Development",
      description: "Build complete web applications from frontend to backend. Learn modern frameworks, databases, APIs, and deployment strategies essential for professional development.",
      duration: "8 weeks (2 months)",
      level: "Intermediate",
      modules: [
        {
          week: 1,
          title: "Web Fundamentals & Frontend Setup",
          topics: [
            "HTML5 semantic structure",
            "CSS3 flexbox and grid layouts",
            "Responsive design principles",
            "CSS preprocessors (SASS/LESS basics)",
            "Accessibility and SEO basics",
            "Developer tools and debugging in browsers"
          ]
        },
        {
          week: 2,
          title: "JavaScript Essentials",
          topics: [
            "Variables, data types, and operators",
            "Functions and scope in JavaScript",
            "ES6+ features: arrow functions, destructuring, spread operator",
            "Async/await and promises",
            "Callbacks and event handling",
            "DOM manipulation and selectors"
          ]
        },
        {
          week: 3,
          title: "React Fundamentals",
          topics: [
            "Components: functional and class components",
            "JSX syntax and rendering",
            "Props and state management",
            "Hooks: useState, useEffect, useContext",
            "Event handling and forms",
            "Conditional rendering and lists"
          ]
        },
        {
          week: 4,
          title: "Advanced React & State Management",
          topics: [
            "Custom hooks and hook patterns",
            "Context API for global state",
            "Redux or Zustand for complex state",
            "Component optimization and memoization",
            "React Router for navigation",
            "Performance optimization techniques"
          ]
        },
        {
          week: 5,
          title: "Backend Fundamentals & Node.js",
          topics: [
            "Node.js architecture and event-driven programming",
            "Express.js server creation",
            "Middleware and request handling",
            "Routing: GET, POST, PUT, DELETE methods",
            "Environment variables and configuration",
            "Error handling and logging"
          ]
        },
        {
          week: 6,
          title: "Databases & API Development",
          topics: [
            "Relational databases: SQL and PostgreSQL",
            "NoSQL databases: MongoDB basics",
            "ORMs: Sequelize or Mongoose",
            "Designing RESTful APIs",
            "Authentication: JWT and sessions",
            "API validation and error responses"
          ]
        },
        {
          week: 7,
          title: "Advanced Features & Security",
          topics: [
            "Role-based access control (RBAC)",
            "API rate limiting and security",
            "CORS, CSRF, and XSS protection",
            "File uploads and processing",
            "Real-time communication with WebSockets",
            "Payment integration basics"
          ]
        },
        {
          week: 8,
          title: "Deployment & DevOps Basics",
          topics: [
            "Version control: Git and GitHub workflows",
            "CI/CD pipelines introduction",
            "Deployment platforms: Heroku, Vercel, AWS",
            "Docker basics for containerization",
            "Environment setup and database migrations",
            "Performance monitoring and debugging in production"
          ]
        }
      ]
    },
    cloud: {
      name: "Cloud Computing",
      description: "Master cloud platforms and learn to build, deploy, and scale applications. Essential knowledge for modern software architecture and DevOps practices.",
      duration: "8 weeks (2 months)",
      level: "Intermediate",
      modules: [
        {
          week: 1,
          title: "Cloud Computing Fundamentals",
          topics: [
            "Cloud computing models: IaaS, PaaS, SaaS",
            "Public, private, and hybrid clouds",
            "Cloud providers overview: AWS, Azure, GCP",
            "Scalability, reliability, and cost benefits",
            "Cloud security basics",
            "Hands-on: Creating cloud accounts"
          ]
        },
        {
          week: 2,
          title: "AWS Core Services",
          topics: [
            "EC2: Virtual machines and instances",
            "S3: Object storage and data management",
            "Elastic Load Balancer and auto-scaling",
            "RDS: Managed relational databases",
            "CloudFront: Content delivery network",
            "IAM: Identity and access management"
          ]
        },
        {
          week: 3,
          title: "Containerization with Docker",
          topics: [
            "Container concepts and benefits",
            "Docker images and containers",
            "Dockerfile creation and best practices",
            "Docker Compose for multi-container apps",
            "Docker registry and image management",
            "Container optimization and security"
          ]
        },
        {
          week: 4,
          title: "Orchestration with Kubernetes",
          topics: [
            "Kubernetes architecture and components",
            "Pods, deployments, and services",
            "Configuration management",
            "Persistent storage and volumes",
            "Ingress and networking",
            "Scaling and resource management"
          ]
        },
        {
          week: 5,
          title: "Serverless Computing",
          topics: [
            "AWS Lambda functions",
            "Serverless architecture patterns",
            "API Gateway and event-driven systems",
            "Database services: DynamoDB, Firestore",
            "Cost optimization for serverless",
            "Monitoring serverless applications"
          ]
        },
        {
          week: 6,
          title: "Data & Analytics on Cloud",
          topics: [
            "Cloud databases: BigQuery, Redshift",
            "Data lakes and data warehousing",
            "ETL and data pipelines",
            "Machine learning on cloud",
            "Analytics and reporting tools",
            "Data governance and compliance"
          ]
        },
        {
          week: 7,
          title: "Cloud Security & Compliance",
          topics: [
            "Encryption and key management",
            "Network security and firewalls",
            "Identity and access management best practices",
            "Compliance standards: GDPR, HIPAA, SOC 2",
            "Vulnerability scanning and patching",
            "Cloud security best practices"
          ]
        },
        {
          week: 8,
          title: "Cloud Architecture & Optimization",
          topics: [
            "Designing scalable architectures",
            "High availability and disaster recovery",
            "Cost optimization strategies",
            "Performance tuning",
            "Monitoring and logging with CloudWatch",
            "Real-world case studies and project implementation"
          ]
        }
      ]
    },
    analytics: {
      name: "Data Analytics",
      description: "Transform data into actionable insights. Learn statistical analysis, visualization, and business intelligence tools essential for data-driven decision making.",
      duration: "8 weeks (2 months)",
      level: "Beginner to Intermediate",
      modules: [
        {
          week: 1,
          title: "Data Analytics Fundamentals",
          topics: [
            "What is data analytics and its importance",
            "Data types: structured, unstructured, semi-structured",
            "Analytics vs Business Intelligence vs Data Science",
            "Data visualization principles",
            "Career paths in analytics",
            "Tools landscape overview"
          ]
        },
        {
          week: 2,
          title: "Excel for Data Analysis",
          topics: [
            "Advanced Excel: formulas and functions",
            "Pivot tables and data summarization",
            "VLOOKUP, INDEX-MATCH, and data lookup",
            "Charts and conditional formatting",
            "Data validation and cleaning",
            "Statistical functions in Excel"
          ]
        },
        {
          week: 3,
          title: "SQL for Data Querying",
          topics: [
            "Database basics and relational models",
            "SELECT, WHERE, and filtering",
            "JOINs: INNER, LEFT, RIGHT, FULL",
            "GROUP BY and aggregations",
            "Subqueries and window functions",
            "Query optimization and indexing"
          ]
        },
        {
          week: 4,
          title: "Statistics & Data Interpretation",
          topics: [
            "Descriptive statistics: mean, median, mode",
            "Distributions and probability",
            "Hypothesis testing and confidence intervals",
            "Correlation and regression analysis",
            "A/B testing and experimental design",
            "Statistical thinking for non-statisticians"
          ]
        },
        {
          week: 5,
          title: "Python for Data Analysis",
          topics: [
            "NumPy for numerical computing",
            "Pandas for data manipulation and cleaning",
            "Data wrangling and transformation",
            "Missing data handling",
            "Time series analysis",
            "Performance optimization with Python"
          ]
        },
        {
          week: 6,
          title: "Data Visualization & BI Tools",
          topics: [
            "Matplotlib and Seaborn for Python visualization",
            "Tableau fundamentals and dashboards",
            "Power BI basics and reports",
            "Interactive visualizations",
            "Storytelling with data",
            "Dashboard design best practices"
          ]
        },
        {
          week: 7,
          title: "Advanced Analytics & Insights",
          topics: [
            "Predictive analytics basics",
            "Customer segmentation and clustering",
            "Cohort analysis",
            "Retention and churn analysis",
            "RFM analysis for customer value",
            "Business metrics and KPIs"
          ]
        },
        {
          week: 8,
          title: "Real-World Projects & Case Studies",
          topics: [
            "End-to-end analytics project",
            "Data pipeline creation",
            "Building dashboards from scratch",
            "Presenting findings and insights",
            "Interview preparation for analyst roles",
            "Ethics in data analytics"
          ]
        }
      ]
    },
    datascience: {
      name: "Data Science",
      description: "Combine statistics, programming, and domain knowledge to solve complex problems. Learn machine learning, data preprocessing, and real-world project implementation.",
      duration: "8 weeks (2 months)",
      level: "Intermediate to Advanced",
      modules: [
        {
          week: 1,
          title: "Data Science Workflow & Setup",
          topics: [
            "Data science lifecycle and methodology",
            "Problem definition and scoping",
            "Environment setup: Python, Jupyter, libraries",
            "Version control for data science",
            "Reproducibility and documentation",
            "Kaggle and competition basics"
          ]
        },
        {
          week: 2,
          title: "Data Preprocessing & EDA",
          topics: [
            "Data collection and sources",
            "Exploratory data analysis (EDA)",
            "Handling missing values and outliers",
            "Data cleaning and validation",
            "Feature scaling and normalization",
            "Statistical analysis and visualization"
          ]
        },
        {
          week: 3,
          title: "Feature Engineering & Selection",
          topics: [
            "Feature creation from raw data",
            "Domain-specific feature engineering",
            "Feature importance and selection methods",
            "Dimensionality reduction: PCA, t-SNE",
            "Handling categorical variables",
            "Interaction features and polynomial features"
          ]
        },
        {
          week: 4,
          title: "Machine Learning Fundamentals",
          topics: [
            "Supervised vs unsupervised learning",
            "Regression: Linear, Ridge, Lasso",
            "Classification: Logistic regression, Decision Trees",
            "Model training and validation",
            "Cross-validation and hyperparameter tuning",
            "Evaluation metrics for different problems"
          ]
        },
        {
          week: 5,
          title: "Advanced ML Algorithms",
          topics: [
            "Ensemble methods: Random Forest, Gradient Boosting",
            "Support Vector Machines (SVM)",
            "K-Nearest Neighbors and clustering",
            "Neural networks introduction",
            "Algorithm selection and trade-offs",
            "Avoiding overfitting and underfitting"
          ]
        },
        {
          week: 6,
          title: "Deep Learning Basics",
          topics: [
            "Neural network architecture",
            "TensorFlow and PyTorch basics",
            "Convolutional Neural Networks (CNNs)",
            "Recurrent Neural Networks (RNNs)",
            "Training neural networks",
            "Transfer learning and pre-trained models"
          ]
        },
        {
          week: 7,
          title: "Advanced Topics & Optimization",
          topics: [
            "Natural Language Processing (NLP) basics",
            "Time series forecasting",
            "Anomaly detection",
            "Recommendation systems",
            "Model optimization and deployment",
            "Big data tools: Spark, Hadoop basics"
          ]
        },
        {
          week: 8,
          title: "Capstone Project & Production",
          topics: [
            "End-to-end data science project",
            "Building ML pipelines",
            "Model deployment and serving",
            "Monitoring and maintenance",
            "Presentation and stakeholder communication",
            "Real-world considerations and ethics"
          ]
        }
      ]
    },
    ai: {
      name: "Fundamentals of AI",
      description: "Explore artificial intelligence from first principles. Understand algorithms, machine learning, neural networks, and AI applications transforming industries.",
      duration: "8 weeks (2 months)",
      level: "Intermediate",
      modules: [
        {
          week: 1,
          title: "AI Concepts & History",
          topics: [
            "What is Artificial Intelligence?",
            "AI vs Machine Learning vs Deep Learning",
            "Brief history of AI",
            "AI applications across industries",
            "Ethics and responsible AI",
            "Career paths in AI"
          ]
        },
        {
          week: 2,
          title: "Foundations & Search Algorithms",
          topics: [
            "Problem solving with AI",
            "State space and search problems",
            "Uninformed search: BFS, DFS",
            "Informed search: A*, heuristics",
            "Constraint satisfaction problems",
            "Game playing and minimax algorithm"
          ]
        },
        {
          week: 3,
          title: "Knowledge Representation",
          topics: [
            "Logic and reasoning",
            "First-order logic",
            "Knowledge graphs",
            "Ontologies and semantic web",
            "Rule-based systems",
            "Inference engines"
          ]
        },
        {
          week: 4,
          title: "Machine Learning Fundamentals",
          topics: [
            "Learning paradigms: supervised, unsupervised, reinforcement",
            "Training and testing",
            "Bias-variance trade-off",
            "Decision trees and rule learning",
            "Naive Bayes classifier",
            "Ensemble methods introduction"
          ]
        },
        {
          week: 5,
          title: "Neural Networks & Deep Learning",
          topics: [
            "Biological neurons and artificial neurons",
            "Perceptrons and MLPs",
            "Backpropagation algorithm",
            "Activation functions",
            "Convolutional Neural Networks",
            "Recurrent Neural Networks"
          ]
        },
        {
          week: 6,
          title: "Natural Language Processing",
          topics: [
            "NLP fundamentals",
            "Tokenization and parsing",
            "Word embeddings: Word2Vec, GloVe",
            "Transformer models and BERT",
            "Sentiment analysis",
            "Machine translation basics"
          ]
        },
        {
          week: 7,
          title: "Computer Vision & Robotics",
          topics: [
            "Image processing fundamentals",
            "Object detection and recognition",
            "Semantic segmentation",
            "Face recognition",
            "Robotics basics",
            "Perception for autonomous systems"
          ]
        },
        {
          week: 8,
          title: "Advanced Topics & Applications",
          topics: [
            "Reinforcement learning",
            "Generative AI: GANs and VAEs",
            "AI in autonomous vehicles",
            "AI for healthcare and diagnosis",
            "Ethical considerations and bias",
            "Future of AI and hands-on capstone"
          ]
        }
      ]
    },
    ml: {
      name: "Machine Learning",
      description: "Master machine learning algorithms and techniques. Build predictive models, understand deep learning, and apply ML to real-world problems.",
      duration: "8 weeks (2 months)",
      level: "Intermediate to Advanced",
      modules: [
        {
          week: 1,
          title: "ML Fundamentals & Workflow",
          topics: [
            "What is Machine Learning?",
            "Types: Supervised, Unsupervised, Reinforcement",
            "ML workflow and pipeline",
            "Data collection and preparation",
            "Train-test split and validation",
            "Performance metrics and evaluation"
          ]
        },
        {
          week: 2,
          title: "Supervised Learning: Regression",
          topics: [
            "Linear regression from scratch",
            "Polynomial regression",
            "Ridge and Lasso regression",
            "Elastic Net",
            "Regression evaluation metrics",
            "Real-world regression problems"
          ]
        },
        {
          week: 3,
          title: "Supervised Learning: Classification",
          topics: [
            "Logistic regression",
            "Decision Trees and tree pruning",
            "k-Nearest Neighbors (KNN)",
            "Naive Bayes classifier",
            "Support Vector Machines (SVM)",
            "Multi-class classification strategies"
          ]
        },
        {
          week: 4,
          title: "Ensemble Methods",
          topics: [
            "Bagging and Bootstrap",
            "Random Forests",
            "Boosting: AdaBoost, Gradient Boosting",
            "XGBoost and LightGBM",
            "Stacking and blending",
            "Ensemble best practices"
          ]
        },
        {
          week: 5,
          title: "Unsupervised Learning & Clustering",
          topics: [
            "K-Means clustering",
            "Hierarchical clustering",
            "DBSCAN and density-based methods",
            "Gaussian Mixture Models",
            "Dimensionality reduction: PCA, t-SNE",
            "Cluster evaluation metrics"
          ]
        },
        {
          week: 6,
          title: "Deep Learning & Neural Networks",
          topics: [
            "Neural network architecture",
            "Backpropagation and optimization",
            "Activation functions and regularization",
            "Convolutional Neural Networks (CNNs)",
            "Recurrent Neural Networks (RNNs)",
            "Transfer learning"
          ]
        },
        {
          week: 7,
          title: "Advanced Techniques & Optimization",
          topics: [
            "Hyperparameter tuning: Grid search, Random search, Bayesian",
            "Cross-validation strategies",
            "Dealing with imbalanced data",
            "Feature engineering and selection",
            "Model interpretability and explainability",
            "Production-ready ML systems"
          ]
        },
        {
          week: 8,
          title: "Capstone Project & Deployment",
          topics: [
            "End-to-end ML project",
            "Model deployment and serving",
            "REST APIs for ML models",
            "Containerization and Docker",
            "Monitoring and model drift detection",
            "Interview preparation and best practices"
          ]
        }
      ]
    },
    cv: {
      name: "Computer Vision",
      description: "Learn how computers see and understand images. Master image processing, object detection, CNNs, and practical applications in real-world scenarios.",
      duration: "8 weeks (2 months)",
      level: "Intermediate to Advanced",
      modules: [
        {
          week: 1,
          title: "Image Processing Fundamentals",
          topics: [
            "Digital images and color spaces",
            "Pixels and image manipulation",
            "Filters and convolutions",
            "Edge detection: Sobel, Canny",
            "Image transformations and warping",
            "Noise reduction and smoothing"
          ]
        },
        {
          week: 2,
          title: "Computer Vision Basics",
          topics: [
            "Camera models and intrinsics",
            "Geometric transformations",
            "Feature detection: Harris, SIFT, ORB",
            "Feature matching and tracking",
            "Stereo vision and depth estimation",
            "Optical flow"
          ]
        },
        {
          week: 3,
          title: "Convolutional Neural Networks (CNNs)",
          topics: [
            "CNN architecture and building blocks",
            "Convolutional and pooling layers",
            "Classic architectures: LeNet, AlexNet, VGGNet",
            "ResNet and skip connections",
            "Mobile architectures: MobileNet, EfficientNet",
            "Training CNNs from scratch vs transfer learning"
          ]
        },
        {
          week: 4,
          title: "Object Detection",
          topics: [
            "Bounding box regression",
            "Region-based methods: R-CNN, Fast R-CNN, Faster R-CNN",
            "YOLO and real-time detection",
            "SSD and feature pyramids",
            "Multi-scale detection",
            "Non-maximum suppression and post-processing"
          ]
        },
        {
          week: 5,
          title: "Semantic & Instance Segmentation",
          topics: [
            "Semantic segmentation basics",
            "FCN, U-Net, and encoder-decoder architectures",
            "Instance segmentation with Mask R-CNN",
            "Panoptic segmentation",
            "Real-time segmentation",
            "3D segmentation basics"
          ]
        },
        {
          week: 6,
          title: "Face Recognition & Biometrics",
          topics: [
            "Face detection: Haar cascades, SSD, RetinaNet",
            "Face alignment and normalization",
            "Face recognition: FaceNet, ArcFace, CosFace",
            "Face verification and identification",
            "Facial attribute analysis",
            "Ethical considerations and bias in face recognition"
          ]
        },
        {
          week: 7,
          title: "Video Analysis & Action Recognition",
          topics: [
            "Optical flow and motion estimation",
            "Action recognition in videos",
            "3D CNNs and two-stream networks",
            "Temporal convolutional networks",
            "Video object tracking",
            "Activity detection and localization"
          ]
        },
        {
          week: 8,
          title: "Real-World Applications & Deployment",
          topics: [
            "Autonomous vehicles perception",
            "Medical image analysis",
            "Document scanning and OCR",
            "Pose estimation and skeleton tracking",
            "Model optimization for edge devices",
            "End-to-end CV pipeline and capstone project"
          ]
        }
      ]
    },
    "experience-selling": {
      name: "Experience Selling Bootcamp",
      description: "We are not selling courses, we are selling experience. Connecting the gap between students and industry via an experience-driven approach to make your career easier.",
      duration: "8 weeks (2 months)",
      level: "Beginner to Advanced",
      modules: [
        {
          week: 1,
          title: "Foundation & Strategy",
          topics: [
            "Session 1 — Introduction + Why Most Students Don't Get Placed",
            "Session 2 — Project Division + Portal + Execution Strategy"
          ]
        },
        {
          week: 2,
          title: "Reality Check & Planning",
          topics: [
            "Session 3 — What I'd Do If I Was In Your Place",
            "Session 4 — Resume vs Reality"
          ]
        },
        {
          week: 3,
          title: "Building Your Presence",
          topics: [
            "Session 5 — How to Ideate & Execute Projects",
            "Session 6 — How to Build LinkedIn & Network"
          ]
        },
        {
          week: 4,
          title: "Industry Insights",
          topics: [
            "Session 7 — What HR Really Thinks & Wants",
            "Session 8 — My Internship Journey & Mistakes"
          ]
        },
        {
          week: 5,
          title: "Interview Mastery",
          topics: [
            "Session 9 — Mock Interview",
            "Session 10 — How To Answer Any Interview Question"
          ]
        },
        {
          week: 6,
          title: "Advanced Skills & Mindset",
          topics: [
            "Session 11 — How To Be a Top 1% Coder",
            "Session 12 — Entrepreneurship & Leadership Thinking"
          ]
        },
        {
          week: 7,
          title: "Final Preparation",
          topics: [
            "Session 13 — Time Management & Multitasking",
            "Session 14 — Final Placement Preparation"
          ]
        },
        {
          week: 8,
          title: "Completion & Next Steps",
          topics: [
            "Session 15 — External Guest Talk",
            "Session 16 — Certification & Project Handoff"
          ]
        }
      ]
    }
  };

  const course = courseId ? courseData[courseId] : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/programs")}>Back to Programs</Button>
        </div>
      </div>
    );
  }

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
            <Button variant="ghost" onClick={() => navigate("/")}>
              Programs
            </Button>
          </div>
        </nav>
      </header>

      {/* Course Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Programs
        </Button>

        <div className="max-w-5xl mx-auto">
          {/* Course Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">{course.name}</h1>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-semibold">{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-semibold">{course.level}</span>
              </div>
            </div>
          </div>

          {/* About Course */}
          <Card className="mb-8 border-primary/30 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="text-2xl">About This Course</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </CardContent>
          </Card>

          {/* Course Timeline */}
          <Card className="border-primary/30 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                8-Week Learning Timeline
              </CardTitle>
              <CardDescription>Master the course progressively with structured modules</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.week} className="border-l-4 border-primary/50 pl-6">
                    <button
                      onClick={() => setExpandedWeek(expandedWeek === module.week ? null : module.week)}
                      className="w-full text-left group"
                    >
                      <div className="flex items-center justify-between py-4 hover:bg-secondary/50 px-4 -mx-4 rounded-lg transition-colors">
                        <div>
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                            Week {module.week}: {module.title}
                          </h3>
                        </div>
                        <div className={`transform transition-transform ${expandedWeek === module.week ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Expandable Topics */}
                    {expandedWeek === module.week && (
                      <div className="bg-secondary/20 rounded-lg p-6 mt-2 space-y-3">
                        {module.topics.map((topic, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                            <p className="text-muted-foreground">{topic}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join thousands of students who are transforming their careers with our comprehensive programs.
                  Get expert guidance, hands-on projects, and industry-relevant skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Button
                    size="lg"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg"
                    onClick={() => window.open("https://chat.whatsapp.com/K1eY2yOQ2Gt0NF5FzSpnMh", "_blank")}
                  >
                    Enroll Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 border-primary hover:bg-primary/10 text-lg"
                    onClick={() => window.location.href = "mailto:upstride.in@gmail.com?subject=Enrollment Inquiry for " + course.name}
                  >
                    Email Us
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-8 w-8 object-contain" />
                <h3 className="text-xl font-bold text-foreground">UPSTRIDE</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Transforming careers through world-class online education. Certified by MSME, Government of India.
              </p>
              <a
                href="mailto:upstride.in@gmail.com"
                className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
              >
                upstride.in@gmail.com
              </a>
            </div>

            {/* CSE/IT Programs */}
            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">CSE/IT Programs</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/course/python")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Fundamentals of Python
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/fullstack")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Fullstack Web Development
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/cloud")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Cloud Computing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/analytics")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Data Analytics
                  </button>
                </li>
              </ul>
            </div>

            {/* Gen AI Programs */}
            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">Gen AI Programs</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/course/datascience")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Data Science
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/ai")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Fundamentals of AI
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/ml")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Machine Learning
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/course/cv")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Computer Vision
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-lg font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/privacy-policy")}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
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
          </div>

          {/* Divider */}
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

export default CourseDetail;
