import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/blogs", label: "Blogs" },
  { to: "/papershelf", label: "Papershelf" },
  { to: "/talks", label: "Talks" },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="nav-brand" onClick={() => setOpen(false)}>
          Mamlesh<span>.</span>
        </NavLink>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        <div className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/login" className="nav-cta" onClick={() => setOpen(false)}>
            Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
