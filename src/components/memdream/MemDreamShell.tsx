import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "@/styles/memdream.css";
import Starfield from "./Starfield";
import { api } from "@/services/api";
import { getVisitorId } from "@/lib/visitorId";

export const REPO_URL = "https://github.com/Mamlesh18/MemDream";

const NAV = [
  { to: "/memdream", label: "Overview", end: true },
  { to: "/memdream/docs", label: "Docs", end: false },
];

interface ShellProps {
  children: ReactNode;
  /** Docs pages render their own sticky section bar under the nav. */
  subnav?: ReactNode;
  /** Match the wider docs grid, so the nav shares its gutters. */
  wide?: boolean;
}

/**
 * The MemDream product shell — a dark, self-contained frame that replaces
 * PublicLayout on /memdream and /memdream/docs/*. It keeps the same
 * fire-and-forget pageview tracking the rest of the public site does, and
 * owns the galaxy background so a page swap never restarts the starfield.
 */
export default function MemDreamShell({ children, subnav, wide = false }: ShellProps) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    // Docs pages re-scroll themselves when a hash is present; leave those be.
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  const container = `mdm-container ${wide ? "mdm-container-wide" : ""}`;

  useEffect(() => {
    api.analytics.track(pathname, getVisitorId()).catch(() => {});
  }, [pathname]);

  return (
    <div className="memdream-root">
      <Starfield />
      <div className="mdm-nebula" aria-hidden="true" />
      <div className="mdm-grid-overlay" aria-hidden="true" />

      <div className="mdm-shell">
        <nav className="mdm-nav">
          <div className={`${container} mdm-nav-inner`}>
            <Link to="/memdream" className="mdm-brand">
              <span className="mdm-brand-mark" aria-hidden="true" />
              Mem<b>Dream</b>
            </Link>

            <button
              type="button"
              className="mdm-nav-toggle"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Close" : "Menu"}
            </button>

            <div className={`mdm-nav-links ${open ? "open" : ""}`}>
              {NAV.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end}>
                  {l.label}
                </NavLink>
              ))}
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <Link to="/" className="mdm-nav-out">
                mamlesh.me ↗
              </Link>
            </div>
          </div>
        </nav>

        {subnav}

        <main>{children}</main>

        <footer className="mdm-footer">
          <div className={container}>
            <div className="mdm-footer-grid">
              <div className="mdm-footer-col">
                <Link to="/memdream" className="mdm-brand" style={{ marginBottom: 14 }}>
                  <span className="mdm-brand-mark" aria-hidden="true" />
                  Mem<b>Dream</b>
                </Link>
                <p className="mdm-faint" style={{ fontSize: "0.83rem", maxWidth: "34ch" }}>
                  A self-maintaining long-term memory layer for AI agents.
                  Open source, self-hostable, audit-complete.
                </p>
              </div>

              <div className="mdm-footer-col">
                <h4>Documentation</h4>
                <Link to="/memdream/docs">Overview</Link>
                <Link to="/memdream/docs/sdk">Python SDK</Link>
                <Link to="/memdream/docs/self-hosting">Self-hosting</Link>
                <Link to="/memdream/docs/api">API reference</Link>
              </div>

              <div className="mdm-footer-col">
                <h4>Project</h4>
                <a href={REPO_URL} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
                <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
                  Issues ↗
                </a>
                <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
                  License ↗
                </a>
              </div>

              <div className="mdm-footer-col">
                <h4>Elsewhere</h4>
                <Link to="/">mamlesh.me</Link>
                <Link to="/blogs">Blogs</Link>
                <Link to="/about">About</Link>
              </div>
            </div>

            <div className="mdm-footer-bottom">
              <span>© 2026 Mamlesh — built in the open.</span>
              <span>MemDream // memory that reasons</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
