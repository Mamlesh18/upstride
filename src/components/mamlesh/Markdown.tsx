import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

const REPO_URL = "https://github.com/Mamlesh18/MemDream";

/** Source file → the docs route that publishes it. */
const DOC_ROUTES: [RegExp, string][] = [
  [/(^|\/)overview\.md$/, "/memdream/docs"],
  // The repo's concepts.md is folded into the published Overview page, whose
  // headings are named to match the anchors concepts.md links use.
  [/(^|\/)concepts\.md$/, "/memdream/docs"],
  [/(^|\/)sdk\.md$/, "/memdream/docs/sdk"],
  [/(^|\/)self-hosting\.md$/, "/memdream/docs/self-hosting"],
  [/(^|\/)api\.md$/, "/memdream/docs/api"],
];

/**
 * Maps a relative link found inside the MemDream repo's own markdown onto a
 * real place on this site: the four docs we publish become routes (anchors
 * preserved), and anything else relative (examples/, config/, .env.example…)
 * falls through to the matching file on GitHub.
 */
function resolveMemDreamHref(href: string): { url: string; external: boolean } {
  if (/^https?:\/\//i.test(href) || href.startsWith("mailto:")) {
    return { url: href, external: true };
  }
  if (href.startsWith("#")) {
    return { url: href, external: false };
  }

  const [pathPart, hash] = href.split("#");
  const cleanPath = pathPart.replace(/^\.?\//, "");
  const suffix = hash ? `#${hash}` : "";

  for (const [pattern, route] of DOC_ROUTES) {
    if (pattern.test(cleanPath)) return { url: `${route}${suffix}`, external: false };
  }

  return { url: `${REPO_URL}/blob/main/${cleanPath}${suffix}`, external: true };
}

const VERB = /^(GET|POST|PATCH|PUT|DELETE)\s+(\/\S+)$/;

/**
 * `### POST /v1/memories` in the API reference renders as a coloured verb chip
 * next to the path, the way every API doc does it. Only exact `VERB /path`
 * headings match, so ordinary prose headings elsewhere on the site are
 * untouched.
 */
function HttpHeading({ children }: { children: ReactNode }) {
  const flat = Array.isArray(children) ? children.join("") : children;
  const match = typeof flat === "string" ? VERB.exec(flat.trim()) : null;
  if (!match) return <>{children}</>;
  const [, verb, path] = match;
  return (
    <>
      <span className={`verb verb-${verb.toLowerCase()}`}>{verb}</span>
      <code className="md-inline-code">{path}</code>
    </>
  );
}

function CodeBlock({ children, className }: { children: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const raw = String(children).replace(/\n$/, "");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="md-pre-wrap">
      <button type="button" className="md-copy-btn" onClick={onCopy}>
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="md-pre">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

interface MarkdownProps {
  children: string;
  /** Render `VERB /path` h3s as verb chips — the API reference page. */
  httpHeadings?: boolean;
}

export default function Markdown({ children, httpHeadings = false }: MarkdownProps) {
  return (
    <div className="md-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          a({ href, children: linkChildren, ...props }) {
            if (!href) return <a {...props}>{linkChildren}</a>;
            const { url, external } = resolveMemDreamHref(href);
            if (external || url.startsWith("#")) {
              return (
                <a
                  href={url}
                  className="link-blue"
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  {...props}
                >
                  {linkChildren}
                </a>
              );
            }
            // Internal doc links route client-side instead of reloading the app.
            return (
              <Link to={url} className="link-blue">
                {linkChildren}
              </Link>
            );
          },
          pre({ children: preChildren }) {
            return <>{preChildren}</>;
          },
          code({ className, children: codeChildren, ...props }) {
            const isBlock = /language-/.test(className || "") || String(codeChildren).includes("\n");
            if (!isBlock) {
              return (
                <code className="md-inline-code" {...props}>
                  {codeChildren}
                </code>
              );
            }
            return <CodeBlock className={className}>{codeChildren}</CodeBlock>;
          },
          h3({ children: h3Children, node: _node, ...props }) {
            return (
              <h3 {...props}>
                {httpHeadings ? <HttpHeading>{h3Children}</HttpHeading> : h3Children}
              </h3>
            );
          },
          table({ children: tableChildren }) {
            return (
              <div className="md-table-wrap">
                <table>{tableChildren}</table>
              </div>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
