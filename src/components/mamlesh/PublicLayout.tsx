import { useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import "@/styles/mamlesh-theme.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AboutMe from "./AboutMe";
import { api } from "@/services/api";
import { getVisitorId } from "@/lib/visitorId";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Fire-and-forget pageview. Never blocks or throws.
    api.analytics.track(pathname, getVisitorId()).catch(() => {});
  }, [pathname]);

  const showAboutMe = pathname !== "/";

  return (
    <div className="mamlesh-site">
      <Navbar />
      <main>{children}</main>
      {showAboutMe && <AboutMe />}
      <Footer />
    </div>
  );
}
