import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

const REPO_URL = "https://github.com/Mamlesh18/MemDream";

/**
 * Maps a relative link found inside the MemDream repo's own markdown
 * (docs/sdk.md, docs/self-hosting.md) onto a real place on this site.
 * - `docs/sdk.md` / `sdk.md` → the SDK section of /memdream/docs
 * - `docs/self-hosting.md` / `self-hosting.md` → the self-hosting section
 * - anything else relative (concepts.md, api.md, examples/, config/…) →
 *   the matching file on GitHub, since we don't publish a page for it
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

  if (/(^|\/)sdk\.md$/.test(cleanPath)) {
    return { url: `/memdream/docs?section=sdk${hash ? `#${hash}` : ""}`, external: false };
  }
  if (/(^|\/)self-hosting\.md$/.test(cleanPath)) {
    return {
      url: `/memdream/docs?section=self-hosting${hash ? `#${hash}` : ""}`,
      external: false,
    };
  }

  return { url: `${REPO_URL}/blob/main/${cleanPath}${hash ? `#${hash}` : ""}`, external: true };
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

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="md-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          a({ href, children: linkChildren, ...props }) {
            if (!href) return <a {...props}>{linkChildren}</a>;
            const { url, external } = resolveMemDreamHref(href);
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
