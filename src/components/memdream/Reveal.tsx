import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

interface RevealProps {
  children: ReactNode;
  /** ms of stagger before this element animates in. */
  delay?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

/**
 * Scroll-reveal for the MemDream pages. Same idea as the mamlesh Reveal, but
 * it uses the `mdm-reveal` class so it stays inside the MemDream stylesheet,
 * and it adds `is-visible` (rather than swapping classes) so other rules —
 * the pipeline pulse, for one — can key off the same signal.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as unknown as React.Ref<HTMLElement>}
      className={`mdm-reveal ${shown ? "is-visible" : ""} ${className}`.trim()}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
