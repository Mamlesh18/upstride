import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfAgreement />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/results" element={<Results />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
