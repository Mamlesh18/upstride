import { useState, useEffect, useRef } from "react";
import { CalendarDays } from "lucide-react";
import { api } from "@/services/api";

const Y = "#FFE500";
const B = "#0A0A0A";
const LB = "#F5F5F5";   // light background
const LB2 = "#EEEEEE";  // alternate section bg
const TEXT = "#0A0A0A";
const MUTE = "#666666";
const BORDER = "#DDDDDD";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const STUDENTS = [
  {
    name: "SRI HARSHA",
    image: "/sri-image.jpg",
    achievement: "From clueless to confident — built a project that changed everything",
    quote: "Before Upstride I knew nothing and had no direction. After joining I got clarity and gained real confidence. The project I built felt like my first step toward something bigger — and I felt that so hard.",
    highlight: "CLARITY GAINED",
  },
  {
    name: "NIVEDITHA",
    image: "/niveditha.jpg",
    achievement: "60-day live internship — now building in AI & participating in buildathons",
    quote: "I only knew concepts before. During the internship I worked on a live project and learned communication, interviews, and time management. My mindset shifted from just learning to actually building.",
    highlight: "INTERNSHIP DONE",
  },
  {
    name: "DIVYA",
    image: "/divya.jpg",
    achievement: "Placed in Central Government — AICTE",
    quote: "Landing a central government role straight out of college wasn't something I imagined. Upstride helped me build the confidence and skills to actually get there.",
    highlight: "GOVT. PLACED",
  },
  {
    name: "ANMOL",
    image: "/anmol.jpg",
    achievement: "AIR 734 in GATE DA",
    quote: "Cracking GATE with a rank of 734 in Data Analytics took serious focus and the right guidance. Upstride helped me build that discipline.",
    highlight: "GATE AIR 734",
  },
  {
    name: "UWAIS",
    image: "/uwais.jpg",
    achievement: "Was clueless — now competing and winning hackathons",
    quote: "I had no idea what I was doing when I joined. Upstride gave me direction. Now I'm going to hackathons and actually winning them. The turnaround is real.",
    highlight: "HACKATHON WINNER",
  },
  {
    name: "VAMSI",
    image: "/vamsi-image.jpeg",
    achievement: "Summer internship at Accenture",
    quote: "Getting into Accenture as a summer intern felt like a big deal. The preparation and project work from Upstride made it possible.",
    highlight: "ACCENTURE INTERN",
  },
  {
    name: "RAJESH S",
    image: "/rajeshs.jpeg",
    achievement: "Placed at Altruist",
    quote: "Getting placed at Altruist was the goal. Upstride kept me focused, pushed me to build real things, and prepared me for how actual teams work.",
    highlight: "PLACED @ ALTRUIST",
  },
  {
    name: "KABIL",
    image: "/Kabil.jpeg",
    achievement: "Building his own startup",
    quote: "Most people talk about starting something. I'm actually doing it. Upstride taught me how to think like a founder, not just an engineer.",
    highlight: "BUILDING STARTUP",
  },
  {
    name: "PRANEETH S",
    image: "/praneeths.jpeg",
    achievement: "Placed to work on a funded project",
    quote: "Working on a funded project right out of college is something most students only dream about. Upstride helped me get there faster than I expected.",
    highlight: "FUNDED PROJECT",
  },
];

const COLLEGES = [
  { name: "SRM AP", logo: "/srm-ap.png" },
  { name: "VIT Vellore", logo: "/vit.jpg" },
  { name: "Kongunadu", logo: "/kongunadu.png" },
  { name: "VIT Chennai", logo: "/vit-chennai.png" },
  { name: "Saveetha", logo: "/saveetha.gif" },
  { name: "NBKRIST", logo: "/NBKRIST_logo.png" },
  { name: "SRM IST", logo: "/srm-ist-logo.jpg" },
  { name: "DB Vaishnav", logo: "/DGVC_LOGO.jpg" },
];

const FREE_RESOURCES = [
  {
    emoji: "📄",
    title: "ATS-OPTIMISED RESUME",
    desc: "Our resume template scores 80+ on every ATS scanner. Used by 200+ students to get past initial screening.",
    tag: "FREE DOWNLOAD",
  },
  {
    emoji: "🌐",
    title: "PORTFOLIO TEMPLATE",
    desc: "A clean, brutalist portfolio template built for engineers. Fork it, personalise it, ship it in a day.",
    tag: "FREE FORK",
  },
  {
    emoji: "📖",
    title: "GITHUB README TEMPLATE",
    desc: "The README template that makes recruiters stop scrolling. Clear, structured, and professional.",
    tag: "FREE COPY",
  },
  {
    emoji: "💼",
    title: "LINKEDIN REVIEW",
    desc: "Drop your LinkedIn and we will give you actionable feedback. No fluff — real changes that get responses.",
    tag: "FREE REVIEW",
  },
];

interface LiveEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  image_data: string | null;
  image_type: string | null;
}

export default function Results() {
  const isMobile = useIsMobile();
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const heroAnim = useInView(0.05);
  const studentsAnim = useInView(0.05);
  const videoAnim = useInView(0.1);
  const hackAnim = useInView(0.1);
  const collegesAnim = useInView(0.1);
  const byomAnim = useInView(0.1);
  const resourcesAnim = useInView(0.1);
  const ctaAnim = useInView(0.1);

  useEffect(() => {
    api.events.getUpcoming().then((r: unknown) => {
      const res = r as { data: { events: LiveEvent[] } };
      setLiveEvents(res.data.events);
    }).catch(() => {});
  }, []);

  const fade = (anim: { visible: boolean }, delay = 0) => ({
    opacity: anim.visible ? 1 : 0,
    transform: anim.visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <div style={{ background: "#FFFFFF", color: TEXT, fontFamily: "'IBM Plex Mono', monospace", minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "14px 16px" : "16px 40px",
        borderBottom: `2px solid ${B}`,
        background: "#fff",
      }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "22px" : "28px", color: B, letterSpacing: "0.08em" }}>UPSTRIDE</span>
        </a>
        <a href="/" style={{
          textDecoration: "none", color: "#fff", background: B,
          fontFamily: "'Bebas Neue', cursive", fontSize: "14px", letterSpacing: "0.1em",
          padding: "8px 18px", border: `2px solid ${B}`,
        }}>
          BACK TO HOME
        </a>
      </nav>

      {/* HERO */}
      <section style={{
        padding: `${isMobile ? "100px" : "120px"} ${isMobile ? "16px" : "40px"} ${isMobile ? "60px" : "80px"}`,
        borderBottom: `2px solid ${B}`,
        background: B,
        color: "#fff",
      }}>
        <div ref={heroAnim.ref} style={{ maxWidth: "1100px", margin: "0 auto", ...fade(heroAnim) }}>
          <div style={{
            display: "inline-block", background: Y, color: B,
            fontFamily: "'Bebas Neue', cursive", fontSize: "13px", letterSpacing: "0.15em",
            padding: "6px 14px", marginBottom: "24px",
          }}>
            REAL STUDENTS. REAL OUTCOMES.
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: isMobile ? "64px" : "110px",
            lineHeight: 0.9, letterSpacing: "0.02em", margin: 0, marginBottom: "24px",
          }}>
            THE RESULTS<br /><span style={{ color: Y }}>DON'T LIE.</span>
          </h1>
          <p style={{ fontSize: isMobile ? "14px" : "16px", color: "#aaa", maxWidth: "600px", lineHeight: 1.7 }}>
            We don't measure success by certificates handed out.<br />
            We measure it by projects shipped, hackathons won, and jobs landed.
          </p>
        </div>
      </section>

      {/* STUDENT SUCCESS STORIES */}
      <section style={{ padding: isMobile ? "60px 16px" : "80px 40px", borderBottom: `2px solid ${BORDER}`, background: "#fff" }}>
        <div ref={studentsAnim.ref} style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ ...fade(studentsAnim), marginBottom: "48px" }}>
            <div style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: isMobile ? "42px" : "64px",
              letterSpacing: "0.02em", color: TEXT,
            }}>
              STUDENT <span style={{ color: Y, WebkitTextStroke: `1px ${B}` }}>SUCCESS STORIES</span>
            </div>
            <p style={{ color: MUTE, fontSize: "13px", marginTop: "8px", maxWidth: "500px" }}>
              These aren't testimonials we chased. These are students who built real things and got real outcomes.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "16px" }}>
            {STUDENTS.map((s, i) => (
              <StudentCard key={s.name} student={s} delay={i * 70} />
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS — same style as landing page */}
      {liveEvents.length > 0 && liveEvents.map((ev, i) => {
        const dateStr = (() => { try { return new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); } catch { return ev.date; } })();
        return (
          <section key={ev.id} style={{ backgroundColor: B, padding: isMobile ? "60px 16px" : "80px 40px", borderTop: i > 0 ? `2px solid #333` : "none" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "32px" : "60px", alignItems: "center" }}>
              {/* Left: Text */}
              <div>
                <div style={{ backgroundColor: Y, color: B, display: "inline-block", padding: "6px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "24px", fontFamily: "'IBM Plex Mono', monospace" }}>
                  UPCOMING EVENT
                </div>
                <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "40px" : "64px", color: "#fff", lineHeight: 0.92, marginBottom: "20px" }}>
                  UPSTRIDE IS<br />
                  <span style={{ color: Y }}>COMING TO</span><br />
                  {ev.location.toUpperCase()}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
                  <div style={{ backgroundColor: Y, border: `3px solid ${Y}`, display: "inline-block", padding: "10px 20px" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: B, fontFamily: "'IBM Plex Mono', monospace" }}>📅 {dateStr.toUpperCase()}</span>
                  </div>
                  <a
                    href="https://jumbled-otter-c02.notion.site/74c1902d7b3a42a59ecb9dcca6cdf7e9?pvs=105"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", backgroundColor: Y, color: B, padding: "10px 22px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.1em", border: `3px solid ${Y}`, boxShadow: `4px 4px 0 ${Y}`, textDecoration: "none", fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    REGISTER NOW →
                  </a>
                </div>
                {ev.title && (
                  <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "24px" : "36px", color: "#fff", marginBottom: "12px", lineHeight: 1 }}>
                    "{ev.title}"
                  </h3>
                )}
                {ev.description && (
                  <p style={{ color: "#ffffff99", fontSize: "14px", lineHeight: 1.8, maxWidth: "420px" }}>
                    {ev.description}
                  </p>
                )}
              </div>
              {/* Right: Image */}
              <div>
                <div style={{ border: `4px solid ${Y}`, boxShadow: `-8px 8px 0 ${Y}`, position: "relative", overflow: "hidden" }}>
                  {ev.image_data ? (
                    <img
                      src={`data:${ev.image_type};base64,${ev.image_data}`}
                      alt={ev.title}
                      style={{ width: "100%", display: "block", objectFit: "contain", backgroundColor: B }}
                    />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "4/3", backgroundColor: `${Y}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CalendarDays size={64} color={Y} />
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 18px", backgroundColor: `${B}dd` }}>
                    <span style={{ fontFamily: "'Bebas Neue', cursive", color: Y, fontSize: "16px", letterSpacing: "0.1em" }}>
                      {ev.location.toUpperCase()} — {dateStr.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* VIDEO */}
      <section style={{ padding: isMobile ? "32px 16px" : "48px 40px", borderBottom: `2px solid ${BORDER}`, background: LB }}>
        <div ref={videoAnim.ref} style={{ maxWidth: "680px", margin: "0 auto", ...fade(videoAnim) }}>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "28px" : "38px", letterSpacing: "0.04em", color: TEXT }}>
              SEE IT <span style={{ borderBottom: `3px solid ${Y}` }}>YOURSELF</span>
            </div>
          </div>
          <div style={{ border: `3px solid ${B}`, background: "#000", overflow: "hidden" }}>
            <video controls playsInline style={{ width: "100%", display: "block", maxHeight: "360px" }}>
              <source src="/upstride-video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* HACKATHON WIN */}
      <section style={{ padding: isMobile ? "60px 16px" : "80px 40px", background: Y, borderBottom: `2px solid ${B}` }}>
        <div ref={hackAnim.ref} style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ ...fade(hackAnim), color: B }}>
            <div style={{
              display: "inline-block", background: B, color: Y,
              fontFamily: "'Bebas Neue', cursive", fontSize: "12px", letterSpacing: "0.15em",
              padding: "5px 12px", marginBottom: "20px",
            }}>
              CHAMPIONSHIP
            </div>
            <h2 style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: isMobile ? "42px" : "72px",
              lineHeight: 0.9, letterSpacing: "0.02em", margin: "0 0 20px",
            }}>
              WE SENT 4 STUDENTS<br />TO CHENNAI.<br />THEY CAME BACK<br />
              <span style={{ textDecoration: "underline", textDecorationThickness: "4px" }}>AS WINNERS.</span>
            </h2>
            <p style={{ fontSize: "14px", maxWidth: "560px", lineHeight: 1.7, marginBottom: "36px" }}>
              Four of our students competed at a national-level hackathon in Chennai — and won. Not because they got lucky. Because they had spent months shipping real things and thinking like engineers.
            </p>

            {/* Hackathon image layout: big left + 2 stacked right */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr", gap: "12px" }}>
              {/* Main win photo */}
              <div style={{ border: `3px solid ${B}`, overflow: "hidden", background: "#000" }}>
                <img
                  src="/hackathon-won.jpg"
                  alt="Hackathon winners"
                  style={{ width: "100%", height: isMobile ? "260px" : "400px", objectFit: "cover", objectPosition: "center", display: "block" }}
                />
              </div>

              {/* Right: where Upstride went + Mamlesh as chief guest */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ border: `3px solid ${B}`, overflow: "hidden", background: "#000", flex: 1 }}>
                  <img
                    src="/kongunadu-hackathon.jpeg"
                    alt="Where Upstride went"
                    style={{ width: "100%", height: "100%", minHeight: "180px", objectFit: "cover", objectPosition: "center", display: "block" }}
                  />
                  <div style={{ background: B, color: Y, fontFamily: "'Bebas Neue', cursive", fontSize: "11px", letterSpacing: "0.12em", padding: "5px 12px" }}>
                    WHERE UPSTRIDE WENT
                  </div>
                </div>
                <div style={{ border: `3px solid ${B}`, overflow: "hidden", background: "#000", flex: 1 }}>
                  <img
                    src="/srm-event.jpeg"
                    alt="Mamlesh as chief guest"
                    style={{ width: "100%", height: "100%", minHeight: "180px", objectFit: "cover", objectPosition: "center", display: "block" }}
                  />
                  <div style={{ background: B, color: Y, fontFamily: "'Bebas Neue', cursive", fontSize: "11px", letterSpacing: "0.12em", padding: "5px 12px" }}>
                    MAMLESH — CHIEF GUEST
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNDED PROJECT */}
      <section style={{ padding: isMobile ? "60px 16px" : "80px 40px", borderBottom: `2px solid ${BORDER}`, background: "#fff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "48px", alignItems: "center" }}>
            <div>
              <div style={{
                display: "inline-block", background: Y, color: B,
                fontFamily: "'Bebas Neue', cursive", fontSize: "12px", letterSpacing: "0.15em",
                padding: "5px 12px", marginBottom: "20px",
              }}>
                INVESTOR BACKED
              </div>
              <h2 style={{
                fontFamily: "'Bebas Neue', cursive",
                fontSize: isMobile ? "40px" : "60px",
                lineHeight: 0.95, letterSpacing: "0.02em", margin: "0 0 20px", color: TEXT,
              }}>
                A PROJECT THAT<br /><span style={{ borderBottom: `4px solid ${Y}` }}>GOT FUNDED.</span>
              </h2>
              <p style={{ color: MUTE, fontSize: "14px", lineHeight: 1.7 }}>
                One of our student teams built a product so compelling it attracted real investor interest. This is what happens when students stop practising and start building.
              </p>
            </div>
            <div style={{ border: `3px solid ${B}`, overflow: "hidden" }}>
              <img
                src="/funded-project.jpg"
                alt="Funded project"
                style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: "380px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* COLLEGES */}
      <section style={{ padding: isMobile ? "60px 16px" : "80px 40px", borderBottom: `2px solid ${BORDER}`, background: LB }}>
        <div ref={collegesAnim.ref} style={{ maxWidth: "1100px", margin: "0 auto", ...fade(collegesAnim) }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "36px" : "52px", letterSpacing: "0.04em", color: TEXT }}>
              COLLEGES WE'VE <span style={{ borderBottom: `4px solid ${Y}` }}>REACHED</span>
            </div>
            <p style={{ color: MUTE, fontSize: "13px", marginTop: "8px" }}>Students from these institutions have trained and shipped at Upstride</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "12px" }}>
            {COLLEGES.map((c) => (
              <div key={c.name} style={{
                border: `2px solid ${BORDER}`, padding: "28px 20px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
                background: "#fff", borderRadius: "2px",
              }}>
                <div style={{ width: "90px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img src={c.logo} alt={c.name} style={{ maxWidth: "90px", maxHeight: "64px", objectFit: "contain" }} />
                </div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", letterSpacing: "0.08em", textAlign: "center", color: TEXT }}>{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BYOM */}
      <section style={{ padding: isMobile ? "60px 16px" : "80px 40px", background: Y, borderBottom: `2px solid ${B}` }}>
        <div ref={byomAnim.ref} style={{ maxWidth: "900px", margin: "0 auto", color: B, ...fade(byomAnim) }}>
          <div style={{
            display: "inline-block", background: B, color: Y,
            fontFamily: "'Bebas Neue', cursive", fontSize: "12px", letterSpacing: "0.15em",
            padding: "5px 12px", marginBottom: "20px",
          }}>
            THE PHILOSOPHY
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "52px" : "80px", lineHeight: 0.9, letterSpacing: "0.02em", margin: "0 0 28px" }}>
            BUILD YOUR<br />OWN MACHINE.
          </h2>
          <p style={{ fontSize: "15px", lineHeight: 1.8, maxWidth: "660px", marginBottom: "20px" }}>
            BYOM is not a catchy acronym. It's a discipline. Every student at Upstride is here to build something — their own product, their own portfolio, their own career. We don't hand you a roadmap and wish you luck. We sit next to you until the thing is shipped.
          </p>
          <p style={{ fontSize: "14px", lineHeight: 1.8, maxWidth: "600px", color: "#444" }}>
            The engineers who stand out aren't the ones who completed the most tutorials. They're the ones who built messy, real things — broke them, fixed them, and shipped them anyway. That's what we train for.
          </p>
        </div>
      </section>

      {/* FREE RESOURCES */}
      <section style={{ padding: isMobile ? "60px 16px" : "80px 40px", borderBottom: `2px solid ${BORDER}`, background: "#fff" }}>
        <div ref={resourcesAnim.ref} style={{ maxWidth: "1100px", margin: "0 auto", ...fade(resourcesAnim) }}>
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              display: "inline-block", background: Y, color: B,
              fontFamily: "'Bebas Neue', cursive", fontSize: "12px", letterSpacing: "0.15em",
              padding: "5px 12px", marginBottom: "16px",
            }}>
              NO STRINGS ATTACHED
            </div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "40px" : "60px", letterSpacing: "0.02em", color: TEXT }}>
              FREE RESOURCES<br /><span style={{ borderBottom: `4px solid ${Y}` }}>TO HELP YOU WIN</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
            {FREE_RESOURCES.map((r) => (
              <div key={r.title} style={{ border: `2px solid ${BORDER}`, padding: "28px 24px", background: LB, position: "relative" }}>
                <div style={{
                  position: "absolute", top: "16px", right: "16px",
                  background: Y, color: B, fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.1em", padding: "3px 8px",
                  fontFamily: "'Bebas Neue', cursive",
                }}>
                  {r.tag}
                </div>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{r.emoji}</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", letterSpacing: "0.06em", marginBottom: "10px", color: TEXT }}>{r.title}</div>
                <p style={{ color: MUTE, fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: "24px", padding: "20px 24px", border: `2px solid ${B}`,
            display: "flex", flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "16px",
          }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", marginBottom: "4px", color: TEXT }}>WANT ALL OF THESE?</div>
              <p style={{ color: MUTE, fontSize: "12px", margin: 0 }}>Join a live session and we'll walk you through every resource.</p>
            </div>
            <a href="/#events" style={{
              display: "inline-block", background: B, color: "#fff", padding: "12px 28px",
              fontFamily: "'Bebas Neue', cursive", fontSize: "16px", letterSpacing: "0.1em",
              textDecoration: "none", border: `2px solid ${B}`, whiteSpace: "nowrap",
            }}>
              SEE UPCOMING EVENTS →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: isMobile ? "80px 16px" : "120px 40px", textAlign: "center", background: B }}>
        <div ref={ctaAnim.ref} style={{ maxWidth: "800px", margin: "0 auto", ...fade(ctaAnim) }}>
          <div style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: isMobile ? "52px" : "90px",
            lineHeight: 0.9, letterSpacing: "0.02em", marginBottom: "28px", color: "#fff",
          }}>
            YOUR NAME<br />BELONGS ON<br /><span style={{ color: Y }}>THIS PAGE.</span>
          </div>
          <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 40px" }}>
            Every student on this page started exactly where you are. The only difference is they decided to start building.
          </p>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "12px", justifyContent: "center", alignItems: "center" }}>
            <a href="/programs" style={{
              display: "inline-block", background: Y, color: B, padding: "18px 40px",
              fontFamily: "'Bebas Neue', cursive", fontSize: "20px", letterSpacing: "0.1em",
              textDecoration: "none", border: `3px solid ${Y}`,
            }}>
              START BUILDING NOW →
            </a>
            <a href="/" style={{
              display: "inline-block", background: "transparent", color: "#fff", padding: "18px 40px",
              fontFamily: "'Bebas Neue', cursive", fontSize: "20px", letterSpacing: "0.1em",
              textDecoration: "none", border: "3px solid #444",
            }}>
              BACK TO HOME
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: `2px solid ${BORDER}`, padding: "24px 40px", background: "#fff",
        display: "flex", flexDirection: isMobile ? "column" : "row",
        alignItems: "center", justifyContent: "space-between", gap: "12px",
      }}>
        <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: B }}>UPSTRIDE</span>
        <span style={{ fontSize: "11px", color: MUTE }}>© 2024 Upstride. All results are real.</span>
        <div style={{ display: "flex", gap: "20px" }}>
          <a href="/privacy-policy" style={{ color: MUTE, fontSize: "11px", textDecoration: "none" }}>Privacy</a>
          <a href="/terms" style={{ color: MUTE, fontSize: "11px", textDecoration: "none" }}>Terms</a>
          <a href="/contact" style={{ color: MUTE, fontSize: "11px", textDecoration: "none" }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}

function StudentCard({ student, delay }: { student: typeof STUDENTS[0]; delay: number }) {
  const anim = useInView(0.05);
  return (
    <div ref={anim.ref} style={{
      border: `2px solid ${BORDER}`,
      background: "#fff",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      opacity: anim.visible ? 1 : 0,
      transform: anim.visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {/* Photo — full face visible */}
      <div style={{ position: "relative", height: "300px", overflow: "hidden", background: LB2 }}>
        <img
          src={student.image}
          alt={student.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 15%",
            display: "block",
          }}
        />
        <div style={{
          position: "absolute", top: "12px", left: "12px",
          background: Y, color: B, fontFamily: "'Bebas Neue', cursive",
          fontSize: "11px", letterSpacing: "0.12em", padding: "3px 10px",
        }}>
          {student.highlight}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 22px" }}>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", letterSpacing: "0.06em", color: TEXT, marginBottom: "10px" }}>
          {student.name}
        </div>
        <div style={{
          fontSize: "12px", color: TEXT, marginBottom: "14px",
          borderLeft: `3px solid ${Y}`, paddingLeft: "10px", lineHeight: 1.5,
          fontWeight: 600,
        }}>
          {student.achievement}
        </div>
        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
          "{student.quote}"
        </p>
      </div>
    </div>
  );
}