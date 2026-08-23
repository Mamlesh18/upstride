import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SsoBootstrap from "./components/SsoBootstrap";

// ── Public site (mamlesh.me theme) ─────────────────────────────────────
const Index = lazy(() => import("./pages/Index"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Papershelf = lazy(() => import("./pages/Papershelf"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const About = lazy(() => import("./pages/About"));
const Talks = lazy(() => import("./pages/Talks"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfAgreement = lazy(() => import("./pages/TermsOfAgreement"));
const Refund = lazy(() => import("./pages/Refund"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ── Auth ───────────────────────────────────────────────────────────────
const Login = lazy(() => import("./pages/Login"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// ── Dashboard (post-login, unchanged) ──────────────────────────────────
const Portal = lazy(() => import("./pages/Portal"));
const Admin = lazy(() => import("./pages/Admin"));
const Workspace = lazy(() => import("./pages/Workspace"));
const Compass = lazy(() => import("./pages/Compass"));
const UpstridesSheet = lazy(() => import("./pages/UpstridesSheet"));
const CheatSheet = lazy(() => import("./pages/CheatSheet"));
const MockInterviewPage = lazy(() => import("./pages/MockInterviewPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const MockInterviewRedirect = () => {
  const location = useLocation();
  return <Navigate to={`/portal/mock-interview${location.search}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SsoBootstrap>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public site */}
            <Route path="/" element={<Index />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/papershelf" element={<Papershelf />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/talks" element={<Talks />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfAgreement />} />
            <Route path="/refund" element={<Refund />} />

            {/* Legacy redirects (old public URLs → new home) */}
            <Route path="/programs" element={<Navigate to="/courses" replace />} />
            <Route path="/contact" element={<Navigate to="/about" replace />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />

            {/* Dashboard — unchanged */}
            <Route path="/portal" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Portal />
              </ProtectedRoute>
            } />
            <Route path="/portal/career-kit/:ckSlug" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Portal />
              </ProtectedRoute>
            } />
            <Route path="/portal/interviews/:ivSlug" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Portal />
              </ProtectedRoute>
            } />
            <Route path="/portal/placements/:companySlug" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Portal />
              </ProtectedRoute>
            } />
            <Route path="/portal/compass" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Compass />
              </ProtectedRoute>
            } />
            <Route path="/portal/:slug" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Portal />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/workspace" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Workspace />
              </ProtectedRoute>
            } />
            <Route path="/upstrides-sheet" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <UpstridesSheet />
              </ProtectedRoute>
            } />
            <Route path="/cheat-sheet/:topic" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <CheatSheet />
              </ProtectedRoute>
            } />
            {/* /portal/mock-interview handles its own auth (accepts SSO) */}
            <Route path="/portal/mock-interview" element={<MockInterviewPage />} />
            <Route path="/mock-interview" element={<MockInterviewRedirect />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </SsoBootstrap>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
