import { ORG_LINKS } from "@/data/mamleshContent";

interface LinkifyProps {
  text: string;
  map?: Record<string, string>;
}

export default function Linkify({ text, map = ORG_LINKS }: LinkifyProps) {
  const keys = Object.keys(map)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (!keys.length || !text) return <>{text}</>;

  const escaped = keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");

  return (
    <>
      {text.split(re).map((part, i) =>
        map[part] ? (
          <a
            key={i}
            className="link-blue"
            href={map[part]}
            target="_blank"
            rel="noreferrer"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
