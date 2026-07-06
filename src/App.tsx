import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SsoBootstrap from "./components/SsoBootstrap";

// Lazy load all page components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Programs = lazy(() => import("./pages/Programs"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Portal = lazy(() => import("./pages/Portal"));
const Login = lazy(() => import("./pages/Login"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Admin = lazy(() => import("./pages/Admin"));
const ProjectManager = lazy(() => import("./pages/ProjectManager"));
const SalesPerson = lazy(() => import("./pages/SalesPerson"));
const Workspace = lazy(() => import("./pages/Workspace"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfAgreement = lazy(() => import("./pages/TermsOfAgreement"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Results = lazy(() => import("./pages/Results"));
const Compass = lazy(() => import("./pages/Compass"));
const Payment = lazy(() => import("./pages/Payment"));
const UpstridesSheet = lazy(() => import("./pages/UpstridesSheet"));
const CheatSheet = lazy(() => import("./pages/CheatSheet"));
const MockInterviewPage = lazy(() => import("./pages/MockInterviewPage"));

const queryClient = new QueryClient();

// Loading fallback component
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
            <Route path="/" element={<Index />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } />
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
            <Route path="/projects" element={
              <ProtectedRoute allowedRoles={["project_manager"]}>
                <ProjectManager />
              </ProtectedRoute>
            } />
            <Route path="/sales" element={
              <ProtectedRoute allowedRoles={["sales_person"]}>
                <SalesPerson />
              </ProtectedRoute>
            } />
            <Route path="/workspace" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Workspace />
              </ProtectedRoute>
            } />
            <Route path="/portal/compass" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Compass />
              </ProtectedRoute>
            } />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfAgreement />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/results" element={<Results />} />
            <Route path="/payment" element={<Payment />} />
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
            {/* /portal/mock-interview is intentionally NOT wrapped in ProtectedRoute —
                the page itself handles both normal auth and the partner SSO
                handshake (?sso=<token>) so external paid students can reach it. */}
            <Route path="/portal/mock-interview" element={<MockInterviewPage />} />
            <Route path="/mock-interview" element={<MockInterviewRedirect />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </SsoBootstrap>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
